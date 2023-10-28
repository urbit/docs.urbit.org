import Head from "next/head";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" type="image/png" href="/images/favicon.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
