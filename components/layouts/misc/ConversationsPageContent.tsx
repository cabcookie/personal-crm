import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface ConversationsPageContentProps {
  children?: ReactNode;
}

const ConversationsPageContent: FC<ConversationsPageContentProps> = ({
  children,
}) => {
  const { isMobile, open } = useSidebar();

  return (
    <div
      className={cn(
        "px-0 mx-0 flex flex-col items-center",
        isMobile || !open ? "w-full" : "w-[calc(100%-var(--sidebar-width))]"
      )}
    >
      <div className="w-full">
        <header className="sticky left-2 top-12 md:top-16 py-1 z-40 bg-bgTransparent">
          <SidebarTrigger />
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
};
export default ConversationsPageContent;
