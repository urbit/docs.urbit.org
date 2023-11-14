window.__MathJax_State__ = {
  isReady: false,
  promise: new Promise((resolve) => {
    window.MathJax = {
      loader: { load: ["[tex]/autoload", "[tex]/ams"] },
      tex: {
        packages: { "[+]": ["autoload", "ams"] },
        processEscapes: true,
      },
      jax: ["input/TeX", "output/CommonHTML"],
      options: {
        renderActions: {
          addMenu: [],
        },
      },
      startup: {
        typeset: false,
        ready: () => {
          MathJax.startup.defaultReady();
          window.__MathJax_State__.isReady = true;
          resolve();
        },
      },
    };
  }),
};
