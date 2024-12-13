import { useGeneralChat } from "@/api/useGeneralChat";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { useRouter } from "next/router";
import ConversationItem from "./ConversationItem";
import NewChatBtn from "./NewChatBtn";

const ConversationsSidebar = () => {
  const { conversations, createConversation, deleteConversation } =
    useGeneralChat();
  const router = useRouter();
  const { id } = router.query;
  const chatId = Array.isArray(id) ? id[0] : id;

  const onCreate = async () => {
    const conversation = await createConversation();
    if (!conversation) return;
    router.push(`/chat/${conversation.id}`);
  };

  const onDelete = async (conversationId: string) => {
    await deleteConversation(conversationId);
    if (conversationId !== chatId) return;
    router.push("/chat");
  };

  return (
    <Sidebar>
      <SidebarContent className="md:pt-20">
        <NewChatBtn createChat={onCreate} />
        <SidebarGroup>
          <SidebarGroupLabel>Previous Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations?.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  onDelete={() => onDelete(conversation.id)}
                  {...{ conversation, isActive: conversation.id === chatId }}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ConversationsSidebar;
