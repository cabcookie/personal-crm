import { a } from "@aws-amplify/backend";

const contextSchema = {
  Context: a.enum(["family", "hobby", "work"]),
  CurrentContext: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      context: a.ref("Context").required(),
    })
    .authorization((allow) => [allow.owner()]),
};

export default contextSchema;
