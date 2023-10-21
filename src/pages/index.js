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
            <h1 className="text-5xl text-white mt-3 mb-24">Developer docs</h1>
            <div className="space-y-16">
              <p className="text-xl text-lite">
                Some placeholder components. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Cras ultricies ante sed risus
                rhoncus viverra. Pellentesque nec pulvinar quam. Suspendisse in
                libero sit amet tellus feugiat mattis. Mauris nisl urna,
                sagittis ut rhoncus condimentum, placerat ut eros. Etiam
                volutpat diam odio, vel accumsan quam pulvinar ac. Praesent
                suscipit felis et leo mollis sagittis. Aenean elementum urna
                quis purus ornare vulputate. In laoreet eros quis arcu feugiat
                imperdiet. Ut semper convallis fermentum.
              </p>
              <ContentCard
                title="Content title (H2b, Medium)"
                description="A short piece of copy about the content, set in the body copy text style. The image is a square based on a 5 column width. The text fills the remainder of the card width. The card is 13 columns wide with a 20px external padding."
                label="Small button style"
                href=""
                imgSrc="https://s3-alpha-sig.figma.com/img/9836/a11a/881068fc8fe89b091e2507792dbdab91?Expires=1698624000&Signature=mFi3XGWqva49cMZyUjJbyrquzTdg-C3zlF1eWBAHZ2LEFKTFywcAHcmKjOPMU68mHHwiaZPEyNyNvbHYSliyByNUTXw-sT1nN~8vv4I3F6OqbdP-5nJo4TYTidZahaWj6QM41x9uZgc7dfSmHak~BGImcMLUoqH-71SzEYKUxwOB2DZDfS13RDAs7EVdAt9Ei608nhsyRWVs6LzQL57jc-lDesSBvhNkNDayETNnX5clyhObWQpdx0pvlFxnm~GkYYhO5Mkr1Nq7DwOKevHhPNGrKL4MiiutfgkFBbrP3E8mRyME346ywxfa1Brwltf~nfpgUrSdEFdfLHmPq7aJHg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
                small
              />
              <FatBlock className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <ConceptCard
                  title="Persistent Identity & Composability"
                  description="Two line description of this concept that contributes to a larger narrative about the technology and links to the overview section."
                  label="Learn more"
                  icon="Arvo"
                  href=""
                  small
                />
                <ConceptCard
                  title="Persistent Identity & Composability"
                  description="Two line description of this concept that contributes to a larger narrative about the technology and links to the overview section."
                  label="Learn more"
                  icon="Arvo"
                  href=""
                  small
                />
              </FatBlock>
              <FatBlock className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <ImageCard
                  colorScheme="gray"
                  title="Insert Card Style Headline"
                  description="More Information Goes Here"
                  href=""
                />
                <ImageCard
                  colorScheme="gray"
                  title="Insert Card Style Headline"
                  description="More Information Goes Here"
                  href=""
                  imgSrc="https://s3-alpha-sig.figma.com/img/9a55/f3da/c1bb6f3362854e8f4c500dce557b6642?Expires=1698624000&Signature=HPYrNSwZcSzreBxt3NS85n73DhCDgo0AlABfx6J8q0mcZVsJ2ybW7oPBSUNW6Ac0usNafdoiQXO0f~4AVeqNCFMhvfrF-FS2XIkEO0yewaqrHNRtsVc7i~67ve7EtfDCtJwP0qSTxE4DDIHARZbZDVTco~QD6GLpKrfhpM439gcfjTZn-ghowX19Fh7m-ttSBJ1SojX3g8aipkFzkvgULUYkSpiX8HIktt4-GdRTU1ILDWWADtrDFdfhtPA~SHdmSjBP6wx7e-4QG0jFnIehVTLzmlK2Ol~5eBnkAem8ekD3XO7eaHDRCxcxYxADY35RtUG6JhmLZWsrDYGDcWbtZQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
                />
                <ImageCard
                  colorScheme="brite"
                  title="Insert Card Style Headline"
                  description="More Information Goes Here"
                  href=""
                />
                <ImageCard
                  colorScheme="lite"
                  title="Insert Card Style Headline"
                  description="More Information Goes Here"
                  href=""
                  imgSrc="https://s3-alpha-sig.figma.com/img/c5be/54df/e472e8cbce6c829aaa63faeef5f7678c?Expires=1698624000&Signature=jVwcFwzZq7XxBRR3r2mVpjV8Xu4XqllYMxusCkqtbOeO9p8hTwZwL1r3nanYLWTd0nUOBXcRTTWzz9G9um0i2B1w3ZxiPsAVjzc-YvZmNQ4tIXB~S8LGNN3fAaSt-hcQfbFka1S1epj7jqAcOlYDMqd23w3q3EnL3p7DabulnuJvGYyWKwoJ7nxs~V~v8WnnxjrBfjK-TjYGeZJJpz9qlO-AGJJmCMcoiPFiWt0zx89N6iPcbv4Eck26i7lSGXALHSIsTa6D5E8sXhY3vqPyZFDNtoZYHEOuGhyothoPY20Cexg42MRb76U-4LwToooxm45vwvQl~oOcjO4RXleamg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
                />
              </FatBlock>
              <FatBlock>
                <ImageCard
                  colorScheme="brite"
                  title="Insert Card Style Headline"
                  description="More Information Goes Here"
                  href=""
                />
              </FatBlock>
              <FatBlock className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <IconCard
                  title="Hoon School"
                  description="Learn the fundamentals of the Hoon programming language"
                  label="View Guide"
                  href="/courses/hoon-school"
                  icon="HoonSchool"
                />
                <IconCard
                  title="App School"
                  description="Learn app development"
                  label="View Guide"
                  href="/courses/app-school"
                  icon="AppSchoolI"
                />
              </FatBlock>
              <FatBlock>
                <IconCard
                  title="App School"
                  description="Learn app development"
                  label="View Guide"
                  href="/courses/app-school"
                  icon="AppSchoolI"
                />
              </FatBlock>
            </div>
          </div>
          <Sidebar className="hidden lg:flex" right />
        </div>
      </Main>
      <Footer />
    </Container>
  );
}
