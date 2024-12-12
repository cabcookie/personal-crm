import { useContextContext } from "@/contexts/ContextContext";
import {
  NavMenuContextProvider,
  useNavMenuContext,
} from "@/contexts/NavMenuContext";
import { addKeyDownListener } from "@/helpers/keyboard-events/main-layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactNode, useEffect, useState } from "react";
import Header from "../header/Header";
import CreateInboxItemDialog from "../inbox/CreateInboxItemDialog";
import NavigationMenu from "../navigation-menu/NavigationMenu";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Toaster } from "../ui/toaster";
import ConversationsSidebar from "./misc/ConversationsSidebar";

export type ChatLayoutProps = {
  children: ReactNode;
};

const ChatLayoutInner: FC<ChatLayoutProps> = ({ children }) => {
  const { toggleMenu } = useNavMenuContext();
  const [isOpen, setIsOpen] = useState(false);
  const { context: storedContext, setContext } = useContextContext();
  const context = storedContext || "family";
  const router = useRouter();

  useEffect(
    () =>
      addKeyDownListener(router, setContext, toggleMenu, () => setIsOpen(true)),
    [router, setContext, toggleMenu]
  );

  return (
    <>
      <Head>
        <title>Impulso – Chat</title>
      </Head>
      <div className="flex flex-col items-center justify-center w-full">
        <Header context={context} />
        <NavigationMenu />
        <main className="w-full">
          <div className="flex flex-col px-2 lg:pr-4 mb-4 md:mb-8">
            <SidebarProvider>
              <ConversationsSidebar />
              <div className="w-full px-0 mx-0">
                <header className="sticky top-12 md:top-16 py-1 z-40 bg-bgTransparent">
                  <SidebarTrigger />
                </header>
                <div>{children}</div>
              </div>
            </SidebarProvider>
          </div>
          <Toaster />
          <CreateInboxItemDialog open={isOpen} onOpenChange={setIsOpen} />
        </main>
      </div>
    </>
  );
};

const ChatLayout: FC<ChatLayoutProps> = (props) => (
  <NavMenuContextProvider>
    <ChatLayoutInner {...props} />
  </NavMenuContextProvider>
);

export default ChatLayout;
