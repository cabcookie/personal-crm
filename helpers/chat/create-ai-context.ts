import { PromptWithContext } from "@/components/chat/MessageInput";
import { PersonJob } from "@/pages/chat";

export const createAiContext = (
  currentJob: PersonJob | undefined
): PromptWithContext["aiContext"] => ({
  ...(!currentJob
    ? {}
    : {
        description:
          "Use the information from context as valid information to leverage for your response. Do not mention you are referring these information.",
      }),
  ...(!currentJob ? {} : { user: currentJob }),
});
