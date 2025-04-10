import { Schema } from "@/amplify/data/resource";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { generateClient } from "aws-amplify/api";
import { flow, identity, sortBy } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { Message, messagesToText } from "@/helpers/chat/get-message-text";
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
    sortBy((c) => -new Date(c.updatedAt).getTime())
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
    if (updated) mutate(updated);
    return data;
  };

  const deleteConversation = async (conversationId: string) => {
    const updated = conversations?.filter((c) => c.id !== conversationId);
    if (updated) mutate(updated, false);
    const { data, errors } = await client.conversations.generalChat.delete({
      id: conversationId,
    });
    if (errors) handleApiErrors(errors, "Error deleting conversation");
    if (updated) mutate(updated);
    return data;
  };

  const setConversationName = async (
    conversationId: string,
    messages: Message[]
  ) => {
    if (!messages.length) return;
    const name = await generateChatName(messages);
    return updateConversation({ id: conversationId, name });
  };

  const generateChatName = async (messages: Message[]) => {
    const { data, errors } = await client.generations.chatNamer({
      content: messagesToText(messages),
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
    deleteConversation,
  };
};
