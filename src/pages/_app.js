import React, { useEffect } from "react";
import Head from "next/head";
import { init } from "@socialgouv/matomo-next";
import "@/styles/globals.css";

const MATOMO_URL = process?.env?.NEXT_PUBLIC_MATOMO_URL || "";
const MATOMO_SITE_ID = process?.env?.NEXT_PUBLIC_MATOMO_SITE_ID || "";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    init({
      url: MATOMO_URL,
      siteId: MATOMO_SITE_ID,
    });

    if (respectSystemPreference()) {
      localStorage.removeItem("theme");
      document.querySelector(":root").removeAttribute("theme");
    } else {
      if (hasSetDark()) {
        document.querySelector(":root").setAttribute("theme", "dark");
      } else {
        document.querySelector(":root").setAttribute("theme", "light");
      }
    }
  });

  const prefersDark = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const hasSetDark = () => {
    const theme = localStorage.getItem("theme");
    return !!theme && theme === "dark";
  };

  const respectSystemPreference = () => !localStorage.getItem("theme");

  const cycleTheme = () => {
    if ((respectSystemPreference() && prefersDark()) || hasSetDark()) {
      if (prefersDark()) {
        localStorage.setItem("theme", "light");
        document.querySelector(":root").setAttribute("theme", "light");
      } else {
        localStorage.removeItem("theme");
        document.querySelector(":root").removeAttribute("theme");
      }
    } else {
      if (!prefersDark()) {
        localStorage.setItem("theme", "dark");
        document.querySelector(":root").setAttribute("theme", "dark");
      } else {
        localStorage.removeItem("theme");
        document.querySelector(":root").removeAttribute("theme");
      }
    }
  };

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
