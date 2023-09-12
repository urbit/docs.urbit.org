import React from "react";
import { useRouter } from "next/router";
import { Container, Main } from "@urbit/fdn-design-system";
import IntraNav from "../../components/IntraNav";
import Footer from "../../components/Footer";
import Content, {
  getStaticProps as props,
  getStaticPaths as paths,
} from "../../components/Content";
import contentTree from "../../../cache/system.json";

const root = "system";

export default function System({
  search,
  posts,
  data,
  markdown,
  params,
  previousPost,
  nextPost,
}) {
  const router = useRouter();

  return (
    <Container>
      <IntraNav />
      <Main>
        <Content
          posts={posts}
          data={data}
          markdown={markdown}
          params={params}
          previousPost={previousPost}
          nextPost={nextPost}
          root={root}
          path={router.asPath}
        />
      </Main>
      <Footer />
    </Container>
  );
}

export async function getStaticProps({ params }) {
  return props(params, root, contentTree);
}

export async function getStaticPaths() {
  return paths(root, contentTree);
}
