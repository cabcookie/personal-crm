import { Schema } from "@/amplify/data/resource";
import { createAIHooks, SendMesageParameters } from "@aws-amplify/ui-react-ai";
import { generateClient } from "aws-amplify/api";
import { flow, identity, sortBy } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>({ authMode: "userPool" });

export const { useAIConversation } = createAIHooks(client);

const fetchConversations = async () => {
  const { data, errors } = await client.conversations.generalChat.list();
  if (errors) {
    handleApiErrors(errors);
    throw errors;
  }
  return flow(
    identity<Schema["generalChat"]["type"][]>,
    sortBy((c) => -new Date(c.createdAt).getTime())
  )(data);
};

export const useGeneralChat = () => {
  const {
    data: conversations,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/chat/general", fetchConversations);

  const createConversation = async () => {
    const { data, errors } = await client.conversations.generalChat.create({});
    console.log("createConversation", { data, errors });
    if (errors) handleApiErrors(errors);
    if (data) mutate([...(conversations || []), data]);
    return data || undefined;
  };

  const updateConversation = async (
    conversation: Partial<Schema["generalChat"]["type"]> & { id: string }
  ) => {
    const updated = conversations?.map((c) =>
      c.id !== conversation.id ? c : { ...c, ...conversation }
    );
    if (updated) mutate(updated, false);
    const { data, errors } =
      await client.conversations.generalChat.update(conversation);
    if (errors) handleApiErrors(errors, "Error updating conversation");
    if (updated) mutate(updated, false);
    return data;
  };

  const setConversationName = async (
    conversationId: string,
    message: SendMesageParameters
  ) => {
    const name = await generateChatName(message);
    return updateConversation({ id: conversationId, name });
  };

  const generateChatName = async (message: SendMesageParameters) => {
    const { data, errors } = await client.generations.chatNamer({
      content: message.content.map((c) => c.text ?? "").join(""),
    });
    if (errors) handleApiErrors(errors, "Error generating chat name");
    return data?.name ?? "";
  };

  return {
    conversations,
    error,
    isLoading,
    createConversation,
    setConversationName,
    generateChatName,
  };
};
