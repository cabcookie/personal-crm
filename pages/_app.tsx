import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import config from "@/amplifyconfiguration.json";
import "@aws-amplify/ui-react/styles.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import {
  ContextContextProvider,
  useContextContext,
} from "@/contexts/ContextContext";
import { contextLocalStorage } from "@/stories/components/navigation-menu/helpers";
import { ProjectsContextProvider } from "@/api/ContextProjects";
import { AccountsContextProvider } from "@/api/ContextAccounts";

Amplify.configure(config);

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
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        ></meta>
      </Head>
      <ContextContextProvider useContextHook={() => contextLocalStorage}>
        <ProjectsContext {...appProps} />
      </ContextContextProvider>
    </>
  );
}

export default withAuthenticator(App);
