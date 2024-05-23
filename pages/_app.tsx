import config from "@/amplify_outputs.json";
import { AccountsContextProvider } from "@/api/ContextAccounts";
import { ProjectsContextProvider } from "@/api/ContextProjects";
import { contexts } from "@/components/navigation-menu/ContextSwitcher";
import {
  Context,
  ContextContextProvider,
  SetContextStateFn,
  useContextContext,
} from "@/contexts/ContextContext";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import type { AppProps } from "next/app";
import { Inter as FontSans } from "next/font/google";
import Head from "next/head";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

Amplify.configure(config);

const CONTEXT_LOCAL_STORAGE_NAME = "currentContext";

export const contextLocalStorage = {
  getContext: (setContext: SetContextStateFn, fallBackContext: Context) => {
    const result: string =
      window.localStorage.getItem(CONTEXT_LOCAL_STORAGE_NAME) ||
      fallBackContext;
    if (contexts.findIndex((c) => c === result) < 0) return;
    setContext(result as Context);
  },
  saveContext: (context: Context) => {
    window.localStorage.setItem(CONTEXT_LOCAL_STORAGE_NAME, context);
  },
};

const ProjectsContext = ({ Component, pageProps }: AppProps) => {
  const { context } = useContextContext();
  return (
    <ProjectsContextProvider context={context}>
      <AccountsContextProvider>
        <Component {...pageProps} />
      </AccountsContextProvider>
    </ProjectsContextProvider>
  );
};

function App(appProps: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover,user-scalable=no"
        ></meta>
      </Head>
      <div
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ContextContextProvider useContextHook={() => contextLocalStorage}>
          <ProjectsContext {...appProps} />
        </ContextContextProvider>
      </div>
    </>
  );
}

export default withAuthenticator(App);
