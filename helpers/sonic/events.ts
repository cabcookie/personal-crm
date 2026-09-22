import { SONIC_SAMPLE_RATE } from "./constants";

/**
 * Builders for Nova 2 Sonic bidirectional input events. Each returns a plain
 * object that the client serializes to JSON and wraps in a stream chunk.
 *
 * We deliberately keep audio OUTPUT configured (Sonic requires it) but never
 * play it — the client discards audioOutput events. Text output + toolUse +
 * usage are what we consume.
 */

export type ToolSpec = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

export const sessionStartEvent = () => ({
  event: {
    sessionStart: {
      inferenceConfiguration: {
        maxTokens: 1024,
        topP: 0.9,
        temperature: 0.7,
      },
      turnDetectionConfiguration: { endpointingSensitivity: "MEDIUM" },
    },
  },
});

export const promptStartEvent = (promptName: string, tools: ToolSpec[]) => ({
  event: {
    promptStart: {
      promptName,
      textOutputConfiguration: { mediaType: "text/plain" },
      audioOutputConfiguration: {
        mediaType: "audio/lpcm",
        sampleRateHertz: 24000,
        sampleSizeBits: 16,
        channelCount: 1,
        voiceId: "matthew",
        encoding: "base64",
        audioType: "SPEECH",
      },
      toolUseOutputConfiguration: { mediaType: "application/json" },
      toolConfiguration: {
        tools: tools.map((t) => ({
          toolSpec: {
            name: t.name,
            description: t.description,
            inputSchema: { json: JSON.stringify(t.inputSchema) },
          },
        })),
        toolChoice: { auto: {} },
      },
    },
  },
});

export const textContentStartEvent = (
  promptName: string,
  contentName: string,
  role: "SYSTEM" | "USER" | "ASSISTANT",
  interactive = false
) => ({
  event: {
    contentStart: {
      promptName,
      contentName,
      type: "TEXT",
      interactive,
      role,
      textInputConfiguration: { mediaType: "text/plain" },
    },
  },
});

export const textInputEvent = (
  promptName: string,
  contentName: string,
  content: string
) => ({
  event: { textInput: { promptName, contentName, content } },
});

export const audioContentStartEvent = (
  promptName: string,
  contentName: string
) => ({
  event: {
    contentStart: {
      promptName,
      contentName,
      type: "AUDIO",
      interactive: true,
      role: "USER",
      audioInputConfiguration: {
        mediaType: "audio/lpcm",
        sampleRateHertz: SONIC_SAMPLE_RATE,
        sampleSizeBits: 16,
        channelCount: 1,
        audioType: "SPEECH",
        encoding: "base64",
      },
    },
  },
});

export const audioInputEvent = (
  promptName: string,
  contentName: string,
  base64Audio: string
) => ({
  event: {
    audioInput: { promptName, contentName, content: base64Audio },
  },
});

export const contentEndEvent = (promptName: string, contentName: string) => ({
  event: { contentEnd: { promptName, contentName } },
});

export const promptEndEvent = (promptName: string) => ({
  event: { promptEnd: { promptName } },
});

export const sessionEndEvent = () => ({ event: { sessionEnd: {} } });

/* ------------------------------ tool result ------------------------------ */

export const toolContentStartEvent = (
  promptName: string,
  contentName: string,
  toolUseId: string
) => ({
  event: {
    contentStart: {
      promptName,
      contentName,
      interactive: false,
      type: "TOOL",
      role: "TOOL",
      toolResultInputConfiguration: {
        toolUseId,
        type: "TEXT",
        textInputConfiguration: { mediaType: "text/plain" },
      },
    },
  },
});

export const toolResultEvent = (
  promptName: string,
  contentName: string,
  content: unknown
) => ({
  event: {
    toolResult: {
      promptName,
      contentName,
      content: JSON.stringify(content),
    },
  },
});
