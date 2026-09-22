/**
 * AudioWorklet processor for the Nova Sonic capture pipeline.
 *
 * Receives mixed mono audio at the AudioContext sample rate, buffers it into
 * fixed-size frames, and posts Float32 frames back to the main thread. The
 * main thread does the 16 kHz resample + Int16 conversion + base64 encoding
 * (kept off the worklet to keep this processor tiny and allocation-light).
 *
 * frameSize is provided via processorOptions and is expressed in samples at
 * the context sample rate.
 */
class PcmRecorderProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const opts = (options && options.processorOptions) || {};
    this._frameSize = opts.frameSize || 512;
    this._buffer = new Float32Array(this._frameSize);
    this._offset = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;
    const channel = input[0];
    if (!channel) return true;

    for (let i = 0; i < channel.length; i++) {
      this._buffer[this._offset++] = channel[i];
      if (this._offset === this._frameSize) {
        // Transfer a copy so we can keep filling the next frame.
        const frame = this._buffer.slice(0);
        this.port.postMessage(frame, [frame.buffer]);
        this._offset = 0;
      }
    }
    return true;
  }
}

registerProcessor("pcm-recorder", PcmRecorderProcessor);
