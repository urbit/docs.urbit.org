import React from "react";
import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://QT6KPZUJMB-dsn.algolia.net" crossorigin />
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.__MathJax_State__ = {
          isReady: false,
          promise: new Promise(resolve => {

            window.MathJax = {
              loader: {load: ['[tex]/autoload', '[tex]/ams']},
              tex: {
                packages: {'[+]': ['autoload', 'ams']},
                processEscapes: true
              },
              jax: ["input/TeX","output/CommonHTML"],
              options: {
                renderActions: {
                  addMenu: []
                }
              },
              startup: {
                typeset: false,
                ready: () => {
                  // setting data-theme so that @docsearch/react understands
                  // whether it should be in dark mode or not
                  if (window.matchMedia) {
                    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                      document.querySelector("html").setAttribute("data-theme", "dark");
                    }
                  }
                  // force docsearch dark-theme for now
                  // delete this once light-mode is implemented
                  // TODO: light-mode
                  document.querySelector("html").setAttribute("data-theme", "dark");

                  MathJax.startup.defaultReady();
                  window.__MathJax_State__.isReady = true;
                  resolve();
                }
              }
            };
          })
        };`,
          }}
        />
        <Script
          strategy="beforeInteractive"
          id="MathJax-script"
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
        />
      </body>
    </Html>
  );
}
