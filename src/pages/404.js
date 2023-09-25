import React from "react";
import Head from "next/head";
import { Container, Main } from "@urbit/fdn-design-system";
import IntraNav from "../components/IntraNav";
import Footer from "../components/Footer";
// import Meta from "../components/Meta";

export default function NotFound(props) {
  const post = {
    title: "404",
  };
  return (
    <Container>
      <Head>
        <title>404 • docs.urbit.org</title>
        {/* {Meta(post)} */}
      </Head>
      <IntraNav />
      <Main>
        <section className="text-brite">
          <h1 className="text-9xl mt-8 mb-64">
            404
          </h1>
          <p className="text-6xl">It looks like nothing is here.</p>
        </section>
      </Main>
      <Footer />
    </Container>
  );
}
