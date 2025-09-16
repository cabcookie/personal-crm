import { a } from "@aws-amplify/backend";

const aiSchema = {
  generalChat: a
    .conversation({
      aiModel: a.ai.model("Claude Sonnet 4"),
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
      aiModel: a.ai.model("Claude Sonnet 4"),
      systemPrompt:
        "**Prompt for Pseudonymizing Meeting Notes**\n\n**Objective:** \nRewrite the provided meeting notes to pseudonymize all confidential information, including the customer name, people's names, and the business industry. The structure, context, and content of the notes should be preserved, including tasks marked with [] or [x].\n\n**Instructions:**\n1. **Customer Name:** Replace the actual customer name with a fictional company name. Ensure the fictional name sounds plausible for a company in a different industry.\n2. **People's Names:** Change all individuals' names to common, gender-neutral fictional names.\n3. **Business Industry:** Shift the context of the business to a different industry. For example, if the original notes are about a tech company, change it to a retail, healthcare, or manufacturing company.\n4. **Preserve Structure:** Maintain the original format of the notes, including any headers, bullet points, and the use of [] or [x] for tasks.\n5. **Language:** Translate the notes into English even if the original notes are in German.\n6. **Confidentiality:** Ensure that all changes sufficiently obscure the original confidential information to protect privacy.\n\n**Example Transformation:**\n- Original: 'Discussed project milestones with ABC Corp. John Doe to follow up on [ ].'\n- Pseudonymized: 'Discussed project milestones with XYZ Retail. Alex Smith to follow up on [ ].'\n\n---\n\n**Expected Output:**\nProvide the rewritten notes with all confidential information pseudonymized as per the instructions above.",
    })
    .arguments({ content: a.string() })
    .returns(a.customType({ response: a.string() }))
    .authorization((allow) => [allow.authenticated()]),
  generateTasksSummary: a
    .generation({
      aiModel: a.ai.model("Amazon Nova Lite"),
      systemPrompt:
        "You are a helpful assistant that analyzes project tasks and creates concise summaries for weekly planning. Your goal is to help users quickly understand which projects need attention by providing intelligent summaries of open tasks.\n\n**Instructions:**\n1. **Analyze the provided list of open tasks** for a single project\n2. **Generate a concise 2-3 sentence summary** highlighting key themes and priorities\n3. **Focus on actionable insights** that help with weekly planning decisions\n4. **Identify patterns and priorities** such as:\n   - Urgent or time-sensitive tasks\n   - Blocked tasks waiting for external input\n   - Tasks that build on each other\n   - Major milestones or deliverables\n5. **Maintain a professional, helpful tone** that supports decision-making\n6. **If no meaningful tasks are provided**, respond with a brief note that the project has no active tasks\n\n**Example Output:**\n- 'Waiting for Victor to sent invite for yearly conference; might be a chance to meet the customer jointly. Victor validates Account Team's oppeness for a whiteboarding session together. Carsten will invite AK for this.'\n- 'We need to consider the Landing Zone offer from PartnerOne and plan a three-person meeting with Emily Thompson, Sarah Johnson, and myself. Mark Anderson is expected to provide information on all three Landing Zone packages this week, including the possibility of 5-year pricing options. We should also arrange a meeting with Sarah Johnson from procurement to discuss the landing zone further. It's important to send Sarah Johnson a list of agreements that she can share internally, and she's specifically requested a presentation of concrete monetary benefits. Lastly, I need to gain a better understanding of T2K, as we can potentially utilize it effectively for funding purposes.'\n\n**Expected Output:**\nProvide only the summary text without additional formatting or explanations.",
    })
    .arguments({ tasks: a.string() })
    .returns(a.customType({ summary: a.string() }))
    .authorization((allow) => [allow.authenticated()]),
};

export default aiSchema;
