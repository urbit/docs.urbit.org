import React, { useState, useEffect } from "react";
import { IntraNav as IntraNavFDS } from "@urbit/fdn-design-system";
import { DocSearch } from "@docsearch/react";
import classnames from "classnames";

const ourSite = {
  title: "Docs",
  href: "https://docs.urbit.org",
};

const sites = [
  {
    title: "Urbit.org",
    href: "https://urbit.org",
    theme: "grn",
  },
  // {
  //   title: "Foundation",
  //   href: "https://urbit.foundation",
  //   theme: "mos",
  // },
  {
    title: "Network Explorer ↗",
    href: "https://network.urbit.org",
    target: "_blank",
  },
];

const pages = [
  { title: "Language", href: "/language" },
  { title: "System", href: "/system" },
  { title: "Userspace", href: "/userspace" },
  { title: "Tools", href: "/tools" },
  { title: "Courses", href: "/courses" },
  { title: "Manual", href: "/manual" },
  { title: "Glossary", href: "/glossary" },
];

const prefersDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const hasSetDark = () => {
  const theme = localStorage.getItem("theme");
  return !!theme && theme === "dark";
};

const respectSystemPreference = () => !localStorage.getItem("theme");

export default function IntraNav({ search }) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (respectSystemPreference()) {
      localStorage.removeItem("theme");
      document.querySelector(":root").removeAttribute("theme");
      if (prefersDark()) {
        setDarkMode(true);
      } else {
        setDarkMode(false);
      }
    } else {
      if (hasSetDark()) {
        document.querySelector(":root").setAttribute("theme", "dark");
        setDarkMode(true);
      } else {
        document.querySelector(":root").setAttribute("theme", "light");
        setDarkMode(false);
      }
    }
  });

  const cycleTheme = () => {
    if ((respectSystemPreference() && prefersDark()) || hasSetDark()) {
      if (prefersDark()) {
        localStorage.setItem("theme", "light");
        document.querySelector(":root").setAttribute("theme", "light");
      } else {
        localStorage.removeItem("theme");
        document.querySelector(":root").removeAttribute("theme");
      }
    } else {
      if (!prefersDark()) {
        localStorage.setItem("theme", "dark");
        document.querySelector(":root").setAttribute("theme", "dark");
      } else {
        localStorage.removeItem("theme");
        document.querySelector(":root").removeAttribute("theme");
      }
    }
    setDarkMode(!darkMode);
  };

  return (
    <IntraNavFDS
      ourSite={ourSite}
      sites={sites}
      pages={pages}
      search={
        <div className="flex h-full w-full space-x-2">
          <DocSearch
            appId="X99UXGCKE0"
            apiKey="a70e321decc1707ae9ce2906bb9bab33"
            indexName="urbit"
          />
          <div
            className={
              "hidden xs:flex items-center h-full w-12 md:w-14 rounded-full bg-brite"
            }
          >
            <button
              className={classnames(
                "aspect-square h-6 md:h-8 mx-0.5 rounded-full bg-gray",
                {
                  "mr-auto": darkMode,
                  "ml-auto": !darkMode,
                }
              )}
              onClick={cycleTheme}
            />
          </div>
        </div>
      }
    />
  );
}
