import CategoryTitle, { CategoryTitleProps } from "@/components/CategoryTitle";
import Header from "@/components/header/Header";
import NavigationMenu from "@/components/navigation-menu/NavigationMenu";
import { Context, useContextContext } from "@/contexts/ContextContext";
import {
  NavMenuContextProvider,
  useNavMenuContext,
} from "@/contexts/NavMenuContext";
import { addKeyDownListener } from "@/helpers/keyboard-events/main-layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactNode, useEffect } from "react";
import { Toaster } from "../ui/toaster";

type MainLayoutProps = CategoryTitleProps & {
  context?: Context;
  recordName?: string;
  sectionName: string;
  children: ReactNode;
};

const MainLayoutInner: FC<MainLayoutProps> = ({
  children,
  recordName,
  sectionName,
  context: propsContext,
  ...categoryTitleProps
}) => {
  const { toggleMenu } = useNavMenuContext();
  const { context: storedContext, setContext } = useContextContext();
  const context = propsContext || storedContext || "family";
  const router = useRouter();

  useEffect(
    () => addKeyDownListener(router, setContext, toggleMenu),
    [router, setContext, toggleMenu]
  );

  return (
    <div>
      <Head>
        <title>{`Impulso ${
          recordName ? `- ${recordName}` : ""
        } · ${sectionName}`}</title>
      </Head>
      <div className="flex flex-col items-center justify-center w-full">
        <Header context={context} />
        <NavigationMenu />
        <main className="w-full xl:w-[64rem]">
          <div className="flex flex-col pb-0">
            <div className="px-3 md:px-8 lg:px-16">
              <div className="relative flex flex-col flex-1">
                <CategoryTitle {...(categoryTitleProps || {})} />
                <div className="flex flex-col flex-1 relative">{children}</div>
              </div>
            </div>
          </div>
          <Toaster />
        </main>
      </div>
    </div>
  );
};

const MainLayout: FC<MainLayoutProps> = (props) => (
  <NavMenuContextProvider>
    <MainLayoutInner {...props} />
  </NavMenuContextProvider>
);

export default MainLayout;
