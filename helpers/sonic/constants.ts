/**
 * Shared constants for the Nova 2 Sonic live meeting-transcription feature
 * (Etappe 1). Everything here is client-side.
 */

// Nova 2 Sonic model + region. Sonic is only available in a few regions;
// us-east-1 is confirmed and is where the app's Bedrock access is enabled.
export const SONIC_MODEL_ID = "amazon.nova-2-sonic-v1:0";
export const SONIC_REGION = "us-east-1";

// Audio format Sonic expects on the input stream: 16 kHz, 16-bit, mono LPCM,
// base64-encoded per audioInput event.
export const SONIC_SAMPLE_RATE = 16000;
export const SONIC_CHANNELS = 1;

// We mix mic + system audio, resample to 16 kHz mono, and emit ~this many ms
// per audioInput frame. The docs cite ~32 ms; a slightly larger frame reduces
// event overhead without hurting latency noticeably.
export const AUDIO_FRAME_MS = 32;

/**
 * Nova 2 Sonic speech/text token rates (USD per token), us-east-1 on-demand.
 * Sourced from public pricing: ~$3 / 1M speech-input tokens, ~$12 / 1M
 * speech-output tokens; text tokens billed at the far cheaper text rate. These
 * are estimates kept next to the raw token counts so a rate change never
 * invalidates a stored figure — the client recomputes cost from tokens.
 *
 * NOTE: verify against the live Nova pricing page before trusting the absolute
 * euro figure; the ratio (speech >> text, output > input) is what matters for
 * the observation phase.
 */
export const SONIC_RATES_USD_PER_TOKEN = {
  inputSpeech: 3.0 / 1_000_000,
  inputText: 0.06 / 1_000_000,
  outputSpeech: 12.0 / 1_000_000,
  outputText: 0.24 / 1_000_000,
} as const;

export type SonicTokenTotals = {
  inputSpeechTokens: number;
  inputTextTokens: number;
  outputSpeechTokens: number;
  outputTextTokens: number;
};

export const estimateSonicCostUsd = (t: SonicTokenTotals): number =>
  t.inputSpeechTokens * SONIC_RATES_USD_PER_TOKEN.inputSpeech +
  t.inputTextTokens * SONIC_RATES_USD_PER_TOKEN.inputText +
  t.outputSpeechTokens * SONIC_RATES_USD_PER_TOKEN.outputSpeech +
  t.outputTextTokens * SONIC_RATES_USD_PER_TOKEN.outputText;
