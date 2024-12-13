import { Schema } from "@/amplify/data/resource";
import { Button } from "@/components/ui/button";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import ConversationName from "./ConversationName";

interface ConversationItemProps {
  conversation: Schema["generalChat"]["type"];
  isActive: boolean;
  onDelete: () => void;
}

const ConversationItem: FC<ConversationItemProps> = ({
  conversation: { id, name, updatedAt },
  isActive,
  onDelete,
}) => (
  <SidebarMenuItem className="group/chat-item relative">
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className="relative w-full h-auto"
    >
      <Link href={`/chat/${id}`} className="flex items-center justify-between">
        <ConversationName
          {...{ name, updatedAt }}
          className="flex flex-col pr-5"
        />
        <Button
          variant="ghost"
          className="absolute p-0.5 right-2 hidden group-hover/chat-item:inline-flex text-gray-300 hover:text-sidebar-foreground"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete();
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

export default ConversationItem;
