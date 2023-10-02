import React from "react";
import Link from "next/link";
import { join } from "path";
import classnames from "classnames";
import {
  Markdown,
  getPage,
  getPreviousPost,
  getNextPost,
  capitalize,
} from "@urbit/fdn-design-system";
import TableOfContents from "./TableOfContents";
import markdocVariables from "../lib/markdocVariables";

function label(str) {
  return str.length > 22 ? str.slice(0, 20).trim() + "..." : str;
}

function NavSection({
  children,
  posts,
  root,
  path,
  indent = 0,
  divider = false,
}) {
  const isUnderThisPage = `${path}/`.includes(`${root}/`);
  return (
    <>
      {divider && <div className="mt-5 mb-6 w-100 h-0.5 rounded-sm bg-gray" />}
      <Link
        className={classnames("font-bold", {
          "text-gray hover:text-brite": !isUnderThisPage,
          "text-brite": isUnderThisPage,
        })}
        style={{ paddingLeft: `${0.5 * indent}rem` }}
        href={`/${root}`}
      >
        {label(posts.title)}
      </Link>
      {isUnderThisPage &&
        posts.pages.map((page) => {
          const href = `/${root}/${page.slug}`;
          const isThisPage = path === href;
          return (
            <Link
              className={classnames("font-light", {
                "text-gray hover:text-brite": !isThisPage,
                "text-brite": isThisPage,
              })}
              style={{ paddingLeft: `${0.5 * (indent + 1)}rem` }}
              href={href}
              key={href}
            >
              {label(page.title)}
            </Link>
          );
        })}
      {isUnderThisPage &&
        posts.children &&
        Object.keys(posts.children).length !== 0 &&
        Object.entries(posts.children).map(([k, v], i) => {
          return (
            <NavSection
              posts={v}
              root={join(root, k)}
              path={path}
              indent={indent + 1}
              key={join(root, k)}
            />
          );
        })}
    </>
  );
}

export default function Content({
  posts,
  data,
  markdown,
  params,
  previousPost,
  nextPost,
  root,
  path,
}) {
  const firstCrumb = path.split("#")[0];
  const md = JSON.parse(markdown);

  const getInnerText = ({ children }) => {
    let innerText = "";
    children.forEach((child) => {
      if (typeof child === "string") {
        innerText += child;
      } else if (typeof child === "object") {
        innerText += getInnerText(child);
      }
    });
    return innerText;
  };

  const headings = md.children.filter((e) => ["h2", "h3"].includes(e.name));
  const headingsCleaned = headings.map((h) => {
    return {
      id: h.attributes?.id,
      innerText: getInnerText(h),
      nodeName: h.name?.toUpperCase(),
    };
  });

  return (
    <div className="relative flex w-full">
      <div className="sticky flex top-12 md:top-16 z-40 py-5 content-height side-bar">
        <nav className="flex flex-col flex-1 type-ui offset-r whitespace-nowrap overflow-y-scroll overflow-x-hidden">
          {(posts.children &&
            Object.keys(posts.children).length !== 0 &&
            Object.entries(posts.children).map(([k, v], i) => {
              return (
                <NavSection
                  posts={v}
                  root={join(root, k)}
                  path={firstCrumb}
                  key={join(root, k)}
                  divider={i > 0}
                />
              );
            })) || <NavSection posts={posts} root={root} path={firstCrumb} />}
        </nav>
        <div className="w-0.5 h-100 rounded-sm bg-gray" />
      </div>
      <div className="flex-1 min-w-0 offset-l">
        <TableOfContents
          headings={headingsCleaned}
          key={params.slug?.join("/") || Math.random()}
        />
        <div className="w-full">
          <h1 className="text-6xl text-white mb-10">
            {data.title}
          </h1>
          <div className="markdown technical">
            <Markdown.render content={md} />
          </div>
          <div className="flex justify-between items-center text-base mt-16 mb-2">
            <a
              className="font-semibold rounded-xl block p-2 text-gray hover:text-brite"
              target="_blank"
              href={`https:github.com/urbit/docs.urbit.org/blob/master/content/${root}/${
                params.slug?.join("/") || "_index"
              }.md`}
            >
              Edit this page on GitHub
            </a>
            <p className="font-semibold block p-2 text-gray">
              Last modified {data.lastModified}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const breadcrumbs = (posts, paths, root) => {
  const results = [<Link href={`/${root}`}>{capitalize(root)}</Link>];
  let thisLink = `/${root}`;
  for (const path of paths) {
    posts = posts.children[path];
    thisLink = join(thisLink, path);
    results.push(
      <span className="px-1">/</span>,
      <Link href={thisLink}>{posts.title}</Link>
    );
  }
  return results;
};

export function getStaticProps(params, root, posts) {
  const { data, content } = getPage(
    join(process.cwd(), `content/${root}`, params.slug?.join("/") || "/"),
    true
  );

  const previousPost =
    getPreviousPost(
      params.slug?.slice(-1).join("") || root,
      ["title", "slug", "weight"],
      join(root, params.slug?.slice(0, -1).join("/") || "/"),
      "weight"
    ) || null;

  const nextPost =
    getNextPost(
      params.slug?.slice(-1).join("") || root,
      ["title", "slug", "weight"],
      join(root, params.slug?.slice(0, -1).join("/") || "/"),
      "weight"
    ) || null;

  const markdown = JSON.stringify(
    Markdown.parse({
      post: { content: String.raw`${content}` },
      variables: markdocVariables,
    })
  );

  return { props: { posts, data, markdown, params, previousPost, nextPost } };
}

export function getStaticPaths(root, posts) {
  const slugs = [];

  const allHrefs = (thisLink, tree) => {
    slugs.push(thisLink, ...tree.pages.map((e) => join(thisLink, e.slug)));
    allHrefsChildren(thisLink, tree.children);
  };

  const allHrefsChildren = (thisLink, children) => {
    Object.entries(children).map(([childSlug, child]) => {
      allHrefs(join(thisLink, childSlug), child);
    });
  };

  allHrefs(`/${root}`, posts);
  return {
    paths: slugs,
    fallback: false,
  };
}
