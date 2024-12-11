import { a } from "@aws-amplify/backend";

const aiSchema = {
  generalChat: a
    .conversation({
      aiModel: a.ai.model("Claude 3.5 Sonnet"),
      systemPrompt: "You are a helpful assistant.",
    })
    .authorization((allow) => allow.owner()),
  chatNamer: a
    .generation({
      aiModel: a.ai.model("Claude 3 Haiku"),
      systemPrompt:
        "You are a helpful assistant that writes descriptive names for conversations. Names should be 2-7 words long",
    })
    .arguments({ content: a.string() })
    .returns(a.customType({ name: a.string() }))
    .authorization((allow) => [allow.authenticated()]),
};

export default aiSchema;
