import { PromptWithContext } from "@/components/chat/MessageInput";
import { PersonJob } from "@/pages/chat";
import { MentionedPerson } from "./set-mentioned-people";

export const createAiContext = (
  currentJob: PersonJob | undefined,
  mentionedPeople: MentionedPerson[] | undefined
): PromptWithContext["aiContext"] => ({
  ...(!currentJob && (!mentionedPeople || mentionedPeople.length === 0)
    ? {}
    : {
        description:
          "Use the information from context as valid information to leverage for your response. Do not mention you are referring these information.",
      }),
  ...(!currentJob ? {} : { user: currentJob }),
  ...(!mentionedPeople || mentionedPeople.length === 0
    ? {}
    : { mentionedPeople }),
});
