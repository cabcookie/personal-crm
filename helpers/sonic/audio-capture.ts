import { AUDIO_FRAME_MS, SONIC_SAMPLE_RATE } from "./constants";

/**
 * Captures microphone + system/tab audio, mixes them, and emits 16 kHz mono
 * 16-bit PCM frames (base64-encoded) suitable for Nova Sonic audioInput events.
 *
 * System audio requires the user to pick "share audio" in the getDisplayMedia
 * prompt; this only works on Chromium desktop browsers. Mic-only still works
 * everywhere. Both streams are summed via the Web Audio graph, captured by an
 * AudioWorklet, then resampled to 16 kHz on the main thread.
 */

export type AudioCaptureOptions = {
  /** Emit each base64-encoded 16 kHz mono PCM frame. */
  onFrame: (base64Pcm: string) => void;
  /** Called if system-audio capture is unavailable/declined (mic-only). */
  onSystemAudioUnavailable?: (reason: string) => void;
  /**
   * Emits the current audio level (0..1, RMS-based) on each frame so the UI
   * can show that audio is actually flowing. Throttled by the frame cadence
   * (~32 ms).
   */
  onLevel?: (level: number) => void;
};

/** RMS amplitude of a Float32 PCM frame, scaled to a lively 0..1 meter. */
const frameLevel = (input: Float32Array): number => {
  let sum = 0;
  for (let i = 0; i < input.length; i++) sum += input[i] * input[i];
  const rms = Math.sqrt(sum / (input.length || 1));
  // Speech RMS is small (~0.02–0.2); scale up and clamp so the meter is
  // visibly responsive without pinning at full on normal speech.
  return Math.min(1, rms * 4);
};

const WORKLET_URL = "/sonic/pcm-recorder.worklet.js";

/** Downsample a Float32 buffer from `inRate` to `outRate` (linear). */
const resample = (
  input: Float32Array,
  inRate: number,
  outRate: number
): Float32Array => {
  if (inRate === outRate) return input;
  const ratio = inRate / outRate;
  const outLength = Math.floor(input.length / ratio);
  const out = new Float32Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const pos = i * ratio;
    const idx = Math.floor(pos);
    const frac = pos - idx;
    const a = input[idx] ?? 0;
    const b = input[idx + 1] ?? a;
    out[i] = a + (b - a) * frac;
  }
  return out;
};

/** Float32 [-1,1] → Int16 LPCM → base64. */
const floatToBase64Pcm = (input: Float32Array): string => {
  const pcm = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(pcm.buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

export class AudioCapture {
  private ctx: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private systemStream: MediaStream | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private readonly opts: AudioCaptureOptions;

  constructor(opts: AudioCaptureOptions) {
    this.opts = opts;
  }

  async start(deviceId?: string): Promise<void> {
    // Microphone is required. Use the chosen input device when provided.
    this.micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
      },
    });

    // System/tab audio is best-effort. If the user declines or the browser
    // can't capture audio, we degrade to mic-only rather than failing.
    try {
      // getDisplayMedia REQUIRES a video request (there is no audio-only mode
      // in the browser), so the user must pick a tab/window/screen. We only
      // ever want the audio track, so we stop and drop the video track the
      // instant the stream is granted — no frame is ever read, processed,
      // stored, or transmitted. This keeps the picker (a browser requirement)
      // while making the "am I sharing my screen?" concern moot.
      this.systemStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      // Discard video immediately — we keep audio only.
      this.systemStream.getVideoTracks().forEach((t) => {
        t.stop();
        this.systemStream?.removeTrack(t);
      });

      const hasAudio = this.systemStream.getAudioTracks().length > 0;
      if (!hasAudio) {
        this.systemStream.getTracks().forEach((t) => t.stop());
        this.systemStream = null;
        this.opts.onSystemAudioUnavailable?.(
          "Kein System-Audio geteilt (Häkchen „Audio teilen“ fehlt). Es wird nur das Mikrofon aufgenommen."
        );
      }
    } catch (err) {
      this.systemStream = null;
      this.opts.onSystemAudioUnavailable?.(
        err instanceof Error ? err.message : "System-Audio nicht verfügbar."
      );
    }

    this.ctx = new AudioContext();
    await this.ctx.audioWorklet.addModule(WORKLET_URL);

    const mixDest = this.ctx.createGain();

    const micSource = this.ctx.createMediaStreamSource(this.micStream);
    micSource.connect(mixDest);

    if (this.systemStream) {
      const sysSource = this.ctx.createMediaStreamSource(this.systemStream);
      sysSource.connect(mixDest);
    }

    const frameSize = Math.round((this.ctx.sampleRate * AUDIO_FRAME_MS) / 1000);
    this.workletNode = new AudioWorkletNode(this.ctx, "pcm-recorder", {
      numberOfInputs: 1,
      numberOfOutputs: 0,
      channelCount: 1,
      processorOptions: { frameSize },
    });

    const inRate = this.ctx.sampleRate;
    this.workletNode.port.onmessage = (ev: MessageEvent<Float32Array>) => {
      // Level from the raw (pre-resample) frame — reflects mic + system mix.
      this.opts.onLevel?.(frameLevel(ev.data));
      const resampled = resample(ev.data, inRate, SONIC_SAMPLE_RATE);
      this.opts.onFrame(floatToBase64Pcm(resampled));
    };

    mixDest.connect(this.workletNode);
  }

  async stop(): Promise<void> {
    this.workletNode?.port.close();
    this.workletNode?.disconnect();
    this.workletNode = null;
    this.micStream?.getTracks().forEach((t) => t.stop());
    this.systemStream?.getTracks().forEach((t) => t.stop());
    this.micStream = null;
    this.systemStream = null;
    if (this.ctx && this.ctx.state !== "closed") await this.ctx.close();
    this.ctx = null;
  }

  hasSystemAudio(): boolean {
    return !!this.systemStream;
  }
}

export type MicDevice = { deviceId: string; label: string };

/**
 * List available microphone input devices. Device labels are only populated
 * after the user has granted mic permission once; before that they come back
 * empty (browsers hide labels until permission is granted).
 */
export const listMicrophones = async (): Promise<MicDevice[]> => {
  if (!navigator.mediaDevices?.enumerateDevices) return [];
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices
    .filter((d) => d.kind === "audioinput")
    .map((d, i) => ({
      deviceId: d.deviceId,
      label: d.label || `Mikrofon ${i + 1}`,
    }));
};
