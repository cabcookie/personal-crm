export type Message = {
  content: {
    text?: string;
  }[];
};

export const messagesToText = (messages: Message[]) =>
  messages.map((m) => m.content.map((c) => c.text ?? "").join("")).join("\n");
