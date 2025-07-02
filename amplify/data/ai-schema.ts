import { a } from "@aws-amplify/backend";

const aiSchema = {
  generalChat: a
    .conversation({
      aiModel: {
        resourcePath: "us.anthropic.claude-sonnet-4-20250514-v1:0",
      },
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
      aiModel: {
        resourcePath: "us.anthropic.claude-sonnet-4-20250514-v1:0",
      },
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
  projectCategorization: a
    .generation({
      aiModel: {
        resourcePath: "us.anthropic.claude-sonnet-4-20250514-v1:0",
      },
      systemPrompt:
        "You are an expert business analyst specializing in categorizing project developments for executive reviews. Your task is to analyze project notes from the past 6 weeks and determine if they contain material worthy of inclusion in an Amazon-style Weekly Business Review.\n\n**Categories:**\n1. **customer_highlights** - Positive developments, wins, successful implementations, new opportunities, strategic partnerships\n2. **customer_lowlights** - Challenges, setbacks, cancelled initiatives, competitive threats, compliance issues\n3. **market_observations** - Industry trends, competitive intelligence, market shifts, regulatory changes\n4. **genai_opportunities** - AI-related initiatives, automation possibilities, ML/AI implementations, innovation projects\n5. **none** - Not significant enough for executive review or doesn't fit other categories\n\n**Analysis Criteria:**\n- Focus on business-impacting developments, not routine operational activities\n- Consider strategic significance, revenue impact, customer relationships, and competitive positioning\n- Look for patterns and themes across the 6-week window\n- Prioritize executive-level insights over tactical details\n\n**Instructions:**\n1. Analyze all provided project notes comprehensively\n2. Identify the most significant business development or theme\n3. Select the most appropriate single category\n4. Provide a brief justification (1-2 sentences) explaining your categorization decision\n\n**Expected Output:**\nRespond with only the category name and brief justification, no additional formatting.",
    })
    .arguments({
      projectName: a.string(),
      projectNotes: a.string(),
      timeWindow: a.string(),
    })
    .returns(
      a.customType({
        category: a.string(),
        justification: a.string(),
      })
    )
    .authorization((allow) => [allow.authenticated()]),
  reviewContentGeneration: a
    .generation({
      aiModel: {
        resourcePath: "us.anthropic.claude-sonnet-4-20250514-v1:0",
      },
      systemPrompt:
        "You are an expert executive communications specialist who creates Amazon-style Weekly Business Review entries. Your task is to transform project developments into concise, high-impact executive summaries.\n\n**Writing Style Guidelines:**\n- Start with company name in brackets: *[CompanyName]*\n- Use italicized keywords for key topics: *1/ Topic Area*, *2/ Second Area*\n- Bold format for next steps: **Next steps:**\n- Write in third person, professional tone\n- Focus on business impact and strategic implications\n- Include specific metrics, timelines, and stakeholder names when relevant\n- End with concrete next steps using (i), (ii) format\n\n**Content Requirements:**\n- Synthesize 6 weeks of project notes into 3-5 sentences\n- Highlight the most business-critical developments\n- Maintain executive-level perspective (strategic, not tactical)\n- Include quantifiable outcomes where possible\n- Emphasize customer impact and business value\n\n**Example Structure:**\n*[CompanyA]* Brief context about the strategic situation. *1/ First Key Area*, description of developments and opportunities; *2/ Second Area*, details about progress and challenges; *3/ Third Area*, focusing on outcomes and implications. **Next steps:** (i) Specific action with timeline. (ii) Second action with responsible party.\n\n**Instructions:**\n1. Transform the provided project notes into a single, cohesive paragraph\n2. Follow the exact formatting and style guidelines above\n3. Ensure content matches the specified category focus\n4. Include actionable next steps based on the project developments\n\n**Expected Output:**\nProvide only the formatted paragraph, no additional text or explanations.",
    })
    .arguments({
      projectName: a.string(),
      projectNotes: a.string(),
      category: a.string(),
      timeWindow: a.string(),
    })
    .returns(
      a.customType({
        content: a.string(),
      })
    )
    .authorization((allow) => [allow.authenticated()]),
  duplicateDetection: a
    .generation({
      aiModel: {
        resourcePath: "us.anthropic.claude-sonnet-4-20250514-v1:0",
      },
      systemPrompt:
        "You are an expert content analyst specializing in detecting duplicate or repetitive content in executive reviews. Your task is to compare a newly generated weekly review entry against historical entries from the past 4 weeks to determine if it represents a significant new development or is merely a repetition of previously reported information.\n\n**Analysis Criteria:**\n- **Significant Change:** New developments, measurable progress, changed circumstances, new stakeholders, different outcomes\n- **Insignificant Change:** Routine updates, minor progress on same initiative, restated goals without new developments\n- **Time Relevance:** Recent developments carry more weight than ongoing situations\n- **Business Impact:** Changes that affect revenue, partnerships, strategic direction, or competitive position\n\n**Evaluation Process:**\n1. Compare the new entry against each historical entry for the same project and category\n2. Identify overlapping themes, initiatives, or developments\n3. Assess whether the new content represents meaningful progression or new information\n4. Consider if the development warrants executive attention given recent history\n\n**Decision Guidelines:**\n- **Include** if: New initiative, significant milestone reached, changed status, new stakeholder involvement, measurable progress, resolution of previous issues\n- **Exclude** if: Repetitive status updates, minor incremental progress, restated previous information without new developments\n\n**Instructions:**\n1. Thoroughly analyze the new entry against all provided historical entries\n2. Make a binary decision: include or exclude\n3. Provide clear reasoning for your decision (2-3 sentences)\n4. If excluding, briefly explain what would make it inclusion-worthy\n\n**Expected Output:**\nRespond with decision (include/exclude) and reasoning only, no additional formatting.",
    })
    .arguments({
      newEntry: a.string(),
      historicalEntries: a.string(),
      category: a.string(),
      projectName: a.string(),
    })
    .returns(
      a.customType({
        decision: a.string(),
        reasoning: a.string(),
      })
    )
    .authorization((allow) => [allow.authenticated()]),
};

export default aiSchema;
