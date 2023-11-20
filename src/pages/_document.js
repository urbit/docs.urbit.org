import React from "react";
import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="preconnect"
          href="https://X99UXGCKE0-dsn.algolia.net"
          crossorigin
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script strategy="beforeInteractive" src="/script/math.js" />
        <Script
          strategy="beforeInteractive"
          id="MathJax-script"
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
        />
      </body>
    </Html>
  );
}
