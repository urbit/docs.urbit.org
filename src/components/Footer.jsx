import { Footer as FooterFDS } from "@urbit/fdn-design-system";

const data = [
  [
    {
      title: "Urbit Docs",
      links: [
        {
          title: "Home",
          href: "/",
        },
        {
          title: "Courses",
          href: "/courses",
        },
        {
          title: "Language",
          href: "/language",
        },
        {
          title: "System",
          href: "/system",
        },
        {
          title: "Userspace",
          href: "/userspace",
        },
        {
          title: "Tools",
          href: "/tools",
        },
        {
          title: "Manual",
          href: "/manual",
        },
        {
          title: "Glossary",
          href: "/glossary",
        },
      ],
    },
    {
      title: " ",
      links: [
        { title: "GitHub", href: "https://github.com/urbit" },
        {
          title: "Airlock APIs",
          href: "https://github.com/urbit/awesome-urbit#http-apis-airlock",
        },
        {
          title: "Urbit Binaries",
          href: "https://github.com/urbit/urbit/releases",
        },
        {
          title: "Developer Mailing List",
          href: "https://groups.google.com/a/urbit.org/g/dev",
        },
        {
          title: "Issue Tracker",
          href: "https://github.com/urbit/urbit/issues",
        },
        { title: "Whitepaper", href: "https://media.urbit.org/whitepaper.pdf" },
      ],
    },
  ],
  [
    { title: "Privacy Policy", href: "https://urbit.org/privacy" },
    { title: "Terms of Service", href: "https://urbit.org/terms-of-service" },
    { title: "support@urbit.org", href: "mailto:support@urbit.org" },
  ],
];

export default function Footer() {
  return <FooterFDS data={data} />;
}
