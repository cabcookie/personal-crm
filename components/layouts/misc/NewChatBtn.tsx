import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import { FC } from "react";

interface NewChatBtnProps {
  createChat: () => void;
}

const NewChatBtn: FC<NewChatBtnProps> = ({ createChat }) => (
  <SidebarGroup>
    <SidebarGroupLabel>Actions</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={createChat}>
            <div className="flex flex-row gap-1">
              <Plus className="w-4 h-4 translate-y-0.5" />
              <span>New Chat</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);

export default NewChatBtn;
