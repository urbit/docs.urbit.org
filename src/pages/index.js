import React, { useState } from "react";
import { Container, Main } from "@urbit/fdn-design-system";
import IntraNav from "../components/IntraNav"
import Footer from "../components/Footer"

export default function Home({ search }) {
  return (
    <Container>
      <IntraNav />
      <Main>
        <h1 className="text-brite text-9xl mt-8 mb-64">
          Developer docs
        </h1>
      </Main>
      <Footer />
    </Container>
  );
}
