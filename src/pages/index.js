import React, { useState } from "react";
import { Container, Main } from "@urbit/fdn-design-system";
import IntraNav from "../components/IntraNav"
import Footer from "../components/Footer"

export default function Home({ search }) {
  return (
    <Container>
      <IntraNav search={() => console.log("Search")} />
      <Main singleColumn>
        <h1 className="text-brite text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light mt-8 mb-64">
          Developer docs
        </h1>
      </Main>
      <Footer />
    </Container>
  );
}
