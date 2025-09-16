import { a } from "@aws-amplify/backend";
import { projectCategorizationPrompt } from "./prompts/project-categorization";
import { generateTasksSummaryPrompt } from "./prompts/generate-task-summary";
import { rewriteProjectNotesPrompt } from "./prompts/rewrite-project-notes";
import { generateWeeklyNarrativePrompt } from "./prompts/generate-weekly-narrative";

const aiSchema = {
  generalChat: a
    .conversation({
      aiModel: a.ai.model("Claude Sonnet 4"),
      systemPrompt: "You are a helpful assistant.",
    })
    .authorization((allow) => allow.owner()),
  chatNamer: a
    .generation({
      aiModel: a.ai.model("Amazon Nova Lite"),
      systemPrompt:
        "You are a helpful assistant that writes descriptive names for conversations. Names should be 2-7 words long. The descriptive name for the conversation should be in the same language as the conversation",
    })
    .arguments({ content: a.string() })
    .returns(a.customType({ name: a.string() }))
    .authorization((allow) => [allow.authenticated()]),
  rewriteProjectNotes: a
    .generation({
      aiModel: a.ai.model("Claude Sonnet 4"),
      systemPrompt: rewriteProjectNotesPrompt,
    })
    .arguments({ content: a.string() })
    .returns(a.customType({ response: a.string() }))
    .authorization((allow) => [allow.authenticated()]),
  generateTasksSummary: a
    .generation({
      aiModel: a.ai.model("Amazon Nova Lite"),
      systemPrompt: generateTasksSummaryPrompt,
    })
    .arguments({ tasks: a.string() })
    .returns(a.customType({ summary: a.string() }))
    .authorization((allow) => [allow.authenticated()]),
  categorizeProjects: a
    .generation({
      aiModel: a.ai.model("Claude Sonnet 4"),
      systemPrompt: projectCategorizationPrompt,
    })
    .arguments({
      projectId: a.string(),
      projectName: a.string(),
      notes: a.string(),
    })
    .returns(
      a.customType({ projectId: a.string(), category: a.string().array() })
    )
    .authorization((allow) => [allow.authenticated()]),
  generateWeeklyNarrative: a
    .generation({
      aiModel: a.ai.model("Claude Sonnet 4"),
      systemPrompt: generateWeeklyNarrativePrompt,
    })
    .arguments({
      projectId: a.string(),
      accountNames: a.string().array(),
      projectName: a.string(),
      notes: a.string(),
      category: a.string(),
    })
    .returns(a.customType({ projectId: a.string(), narrative: a.string() }))
    .authorization((allow) => [allow.authenticated()]),
};

export default aiSchema;
