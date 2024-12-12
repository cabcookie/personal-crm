import { Schema } from "@/amplify/data/resource";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import ConversationName from "./ConversationName";

interface ConversationItemProps {
  conversation: Schema["generalChat"]["type"];
  currentId?: string;
  onDelete: () => void;
}

const ConversationItem: FC<ConversationItemProps> = ({
  conversation: { id, name, updatedAt },
  currentId,
  onDelete,
}) => (
  <SidebarMenuItem>
    <div className={cn("relative group hidden", id === currentId && "block")}>
      <ConversationName
        {...{ name, updatedAt }}
        className="bg-sidebar-accent rounded p-2 font-semibold"
      />
      <Trash2
        onClick={onDelete}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-primary cursor-pointer"
      />
    </div>
    <SidebarMenuButton
      asChild
      className={cn("h-auto", id === currentId && "hidden")}
    >
      <div className="relative group">
        <Link href={`/chat/${id}`}>
          <ConversationName
            {...{ name, updatedAt }}
            className="flex flex-col pr-5 group"
          />
        </Link>
        <Trash2
          onClick={onDelete}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-primary cursor-pointer"
        />
      </div>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

export default ConversationItem;
