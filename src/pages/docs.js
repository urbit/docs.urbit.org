import React from "react";
import Head from "next/head";
import { join } from "path";
import { useRouter } from "next/router";
import {
  Container,
  Main,
  Markdown,
  getPage,
} from "@urbit/fdn-design-system";
import IntraNav from "../components/IntraNav";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Content, {
  getStaticProps as props,
  getStaticPaths as paths,
} from "../components/Content";
import markdocVariables from "../lib/markdocVariables";
import { index as tooltipData } from "../../cache/tooltip.js";

export default function Home({ data, markdown }) {
  const md = JSON.parse(markdown);

  return (
    <>
      <Head>
        <title>Docs • docs.urbit.org</title>
      </Head>
      <Container>
        <IntraNav />
        <Main>
          <div className="flex h-full w-full">
            <Sidebar className="hidden xl:flex" left />
            <div className="flex flex-col flex-1 min-w-0 px-5">
              <h1 className="h1 mt-3 !mb-12 md:!mb-[4.6875rem] 3xl:!mb-[5.625rem]">
                {data.title}
              </h1>
              <div className="markdown technical">
                <Markdown.render content={md} tooltipData={tooltipData} />
              </div>
            </div>
            <Sidebar className="hidden lg:flex" right />
          </div>
        </Main>
        <Footer />
      </Container>
    </>
  );
}

export async function getStaticProps() {
  const { data, content } = getPage(join(process.cwd(), "content/docs"));

  const markdown = JSON.stringify(
    Markdown.parse({
      post: { content: String.raw`${content}` },
      variables: markdocVariables,
    })
  );

  return { props: { data, markdown } };
}
