import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8"></meta>
        <meta name="apple-mobile-web-app-title" content="Impulso"></meta>
        <meta name="application-name" content="Impulso"></meta>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,user-scalable=no"
        ></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
