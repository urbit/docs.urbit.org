import React from "react";
import {
  Container,
  Main,
  Sidebar,
  FatBlock,
  ConceptCard,
  ContentCard,
  IconCard,
  ImageCard,
} from "@urbit/fdn-design-system";
import IntraNav from "../components/IntraNav";
import Footer from "../components/Footer";

export default function Home({ search }) {
  return (
    <Container>
      <IntraNav />
      <Main>
        <div className="flex h-full w-full">
          <Sidebar className="hidden md:flex" left />
          <div className="flex flex-col flex-1 overflow-y-auto min-w-0 px-5 md:pr-8 xl:pr-5">
            <h1 className="text-5xl text-white mt-3 mb-24">Docs</h1>
            <div className="space-y-16">
              <p className="text-xl text-lite">
                Welcome to the Urbit docs. This site contains guides, tutorials
                and reference documentation for all aspects of Urbit development including
                the Hoon language, the Arvo kernel, the runtime Vere, and the identity
                system Azimuth. There's also a user manual to help you get started running
                and operating your Urbit.
              </p>
              <h2 className="text-white text-4xl">Courses</h2>
              <p className="text-xl text-lite">
                There are both regular live tutored courses and in-depth
                tutorials to teach you the Hoon language, Urbit app development, and other
                aspects of the system. If you want to learn how to build things on Urbit,
                these are the best places to start.
              </p>
              <FatBlock className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <IconCard
                  title="Urbit Academy"
                  description="The Urbit Foundation offers live courses for those interested in learning development on Urbit."
                  label="Learn more"
                  href="/courses/urbit-academy"
                  icon="Apprenticeship"
                />
                <IconCard
                  title="Tutorials"
                  description="Learn the Hoon language or Urbit app development at your own pace."
                  label="Learn more"
                  href="/courses"
                  icon="AppSchoolI"
                />
              </FatBlock>
              <h2 className="text-white text-4xl">Developer Docs</h2>
              <p className="text-xl text-lite">
                The developer documentation contains a wealth of guides,
                examples and reference material about all layers of Urbit, from the Hoon
                Language to the kernel and runtime. These are the places to refer to as you
                work on your Urbit project.
              </p>
              <FatBlock className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <IconCard
                  title="Language"
                  description="Guides and reference material for the Hoon language as well as Nock."
                  label="View"
                  href="/language"
                  icon="Hoon"
                />
                <IconCard
                  title="System"
                  description="Documentation of Urbit's kernel Arvo, the runtime Vere, and the identity system Azimuth."
                  label="View"
                  href="/system"
                  icon="Arvo"
                />
                <IconCard
                  title="Userspace"
                  description="Information about building and publishing apps on Urbit."
                  label="View"
                  href="/userspace"
                  icon="Gall"
                />
                <IconCard
                  title="Tools"
                  description="Documentation of additional and external Urbit-related libraries and apps."
                  label="View"
                  href="/tools"
                  icon="OpenDistribution"
                />
              </FatBlock>
              <h2 className="text-white text-4xl">User Docs</h2>
              <p className="text-xl text-lite">
                If you want to get a planet, find a hosting provider, set up a
                server or learn how to use the Dojo, the manual is the place to go.
              </p>
              <FatBlock className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <ConceptCard
                  title="Getting Started"
                  description="You can obtain a planet and run Urbit yourself or let a hosting provider do it for you. How to do these things and more are documented in this section."
                  label="View"
                  icon="Apprenticeship"
                  href=""
                  small
                />
                <ConceptCard
                  title="User Manual"
                  description="Information on running your Urbit, using the Dojo (Urbit's command-line), managing your Urbit ID on Azimuth and more."
                  label="View"
                  icon="UrbitOS"
                  href=""
                  small
                />
              </FatBlock>
              {/*
                <ContentCard
                  title="Content title (H2b, Medium)"
                  description=""
                  label="Small button style"
                  href=""
                  imgSrc=""
                  small
                />
                <FatBlock>
                  <ImageCard
                    colorScheme="brite"
                    title="Insert Card Style Headline"
                    description="More Information Goes Here"
                    href=""
                    imgSrc=""
                  />
                </FatBlock>
              */}
            </div>
          </div>
          <Sidebar className="hidden lg:flex" right />
        </div>
      </Main>
      <Footer />
    </Container>
  );
}
