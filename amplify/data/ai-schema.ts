import { a } from "@aws-amplify/backend";

const aiSchema = {
  generalChat: a
    .conversation({
      aiModel: a.ai.model("Claude 3.5 Sonnet v2"),
      systemPrompt: "You are a helpful assistant.",
    })
    .authorization((allow) => allow.owner()),
};

export default aiSchema;
