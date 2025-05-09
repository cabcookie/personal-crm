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
        "You are a helpful assistant that writes descriptive names for conversations. Names should be 2-7 words long. The descriptive name for the conversation should be in the same language as the conversation",
    })
    .arguments({ content: a.string() })
    .returns(a.customType({ name: a.string() }))
    .authorization((allow) => [allow.authenticated()]),
  rewriteProjectNotes: a
    .generation({
      aiModel: a.ai.model("Claude 3.5 Sonnet v2"),
      systemPrompt:
        "**Prompt for Pseudonymizing Meeting Notes**\n\n**Objective:** \nRewrite the provided meeting notes to pseudonymize all confidential information, including the customer name, people's names, and the business industry. The structure, context, and content of the notes should be preserved, including tasks marked with [] or [x].\n\n**Instructions:**\n1. **Customer Name:** Replace the actual customer name with a fictional company name. Ensure the fictional name sounds plausible for a company in a different industry.\n2. **People's Names:** Change all individuals' names to common, gender-neutral fictional names.\n3. **Business Industry:** Shift the context of the business to a different industry. For example, if the original notes are about a tech company, change it to a retail, healthcare, or manufacturing company.\n4. **Preserve Structure:** Maintain the original format of the notes, including any headers, bullet points, and the use of [] or [x] for tasks.\n5. **Language:** Translate the notes into English even if the original notes are in German.\n6. **Confidentiality:** Ensure that all changes sufficiently obscure the original confidential information to protect privacy.\n\n**Example Transformation:**\n- Original: 'Discussed project milestones with ABC Corp. John Doe to follow up on [ ].'\n- Pseudonymized: 'Discussed project milestones with XYZ Retail. Alex Smith to follow up on [ ].'\n\n---\n\n**Expected Output:**\nProvide the rewritten notes with all confidential information pseudonymized as per the instructions above.",
    })
    .arguments({ content: a.string() })
    .returns(a.customType({ response: a.string() }))
    .authorization((allow) => [allow.authenticated()]),
};

export default aiSchema;
