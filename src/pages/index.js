import React from "react";
import Head from "next/head";
import {
  Container,
  Main,
  FatBlock,
  ConceptCard,
  ContentCard,
  IconCard,
} from "@urbit/fdn-design-system";
import IntraNav from "../components/IntraNav";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function Home({ search }) {
  return (
    <>
      <Head>
        <title>docs.urbit.org</title>
      </Head>
      <Container>
        <IntraNav />
        <Main>
          <div className="flex h-full w-full">
            <Sidebar className="hidden lg:flex" left />
            <div className="flex flex-col flex-1 overflow-y-auto min-w-0 px-5 space-y-8 md:space-y-12">
              <h1 className="h1 mt-3 mb-8">Docs</h1>
              <p className="body-xl">
                Welcome to the Urbit docs. This site contains guides, tutorials
                and reference documentation for all aspects of Urbit development
                including the Hoon language, the Arvo kernel, the runtime Vere,
                and the identity system Azimuth. There's also a user manual to
                help you get started running and operating your Urbit.
              </p>
              <hr className="hr-horizontal border-gray" />
              <h2 className="h2">Courses</h2>
              <p className="body-lg">
                There are both regular live tutored courses and in-depth
                tutorials to teach you the Hoon language, Urbit app development,
                and other aspects of the system. If you want to learn how to
                build things on Urbit, these are the best places to start.
              </p>
              <FatBlock className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <IconCard
                  title="Urbit Academy"
                  description="The Urbit Foundation offers live courses for those interested in learning development on Urbit."
                  href="/courses/urbit-academy"
                  icon="HoonSchool"
                />
                <IconCard
                  title="Tutorials"
                  description="Learn the Hoon language or Urbit app development at your own pace."
                  href="/courses"
                  icon="AppSchoolI"
                />
              </FatBlock>
              <hr className="hr-horizontal border-gray" />
              <h2 className="h2">Developer Docs</h2>
              <p className="body-lg">
                The developer documentation contains a wealth of guides,
                examples and reference material about all layers of Urbit, from
                the Hoon Language to the kernel and runtime. These are the
                places to refer to as you work on your Urbit project.
              </p>
              <FatBlock className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <IconCard
                  title="Language"
                  description="Guides and reference material for the Hoon language as well as Nock."
                  href="/language"
                  icon="Hoon"
                  small
                />
                <IconCard
                  title="System"
                  description="Documentation of Urbit's kernel Arvo, the runtime Vere, and the identity system Azimuth."
                  href="/system"
                  icon="Arvo"
                  small
                />
                <IconCard
                  title="Userspace"
                  description="Information about building and publishing apps on Urbit."
                  href="/userspace"
                  icon="Gall"
                  small
                />
                <IconCard
                  title="Tools"
                  description="Documentation of additional and external Urbit-related libraries and apps."
                  href="/tools"
                  icon="OpenDistribution"
                  small
                />
              </FatBlock>
              <hr className="hr-horizontal border-gray" />
              <h2 className="h2">User Docs</h2>
              <p className="body-lg">
                If you want to get a planet, find a hosting provider, set up a
                server or learn how to use the Dojo, the manual is the place to
                go.
              </p>
              <FatBlock className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <ConceptCard
                  title="Getting Started"
                  description="You can obtain a planet and run Urbit yourself or let a hosting provider do it for you. How to do these things and more are documented in this section."
                  label="View"
                  icon="Apprenticeship"
                  href="/manual/getting-started"
                  small
                />
                <ConceptCard
                  title="User Manual"
                  description="Information on running your Urbit, using the Dojo (Urbit's command-line), managing your Urbit ID on Azimuth and more."
                  label="View"
                  icon="UrbitOS"
                  href="/manual"
                  small
                />
              </FatBlock>
              <hr className="hr-horizontal border-gray" />
              <h2 className="h2">Videos</h2>
              <p className="body-lg">
                We have two Youtube channels: @urbit_ and @urbiteducation. The
                former contains general Urbit-related content including a number
                of developer streams. The latter contains educational material
                including Urbit Academy lessons.
              </p>
              <FatBlock className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <IconCard
                  title="@urbit_"
                  description="General Urbit-related content including developer streams."
                  icon="UrbitOS"
                  href="https://www.youtube.com/@urbit_"
                />
                <IconCard
                  title="@urbiteducation"
                  description="Educational material including Urbit Academy lessons."
                  icon="HoonSchool"
                  href="https://www.youtube.com/@urbiteducation"
                />
              </FatBlock>
            </div>
            <Sidebar className="hidden xl:flex" right />
          </div>
        </Main>
        <Footer />
      </Container>
    </>
  );
}
