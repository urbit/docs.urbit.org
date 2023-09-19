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

function label(str) {
  return str.length > 27 ? str.slice(0, 24) + "..." : str;
}

function NavSection({ posts, root, path, indent = 0 }) {
  const isUnderThisPage = `${path}/`.includes(`${root}/`);
  return (
    <>
      <Link
        className={
          `pl-${indent} font-bold ` +
          classnames({
            "text-gray hover:text-brite": !isUnderThisPage,
            "text-brite": isUnderThisPage,
          })
        }
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
              className={
                `pl-${indent + 4} ` +
                classnames({
                  "text-gray hover:text-brite": !isThisPage,
                  "text-brite": isThisPage,
                })
              }
              href={href}
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
              indent={indent + 4}
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
  return (
    <div className="relative flex w-full">
      <div className="sticky flex top-20 z-40 content-height">
        <nav className="flex flex-col w-68 text-xl leading-tight my-4 pr-10 whitespace-nowrap overflow-y-scroll overflow-x-hidden">
          {(posts.children &&
            Object.keys(posts.children).length !== 0 &&
            Object.entries(posts.children).map(([k, v], i) => {
              return (
                <>
                  {i > 0 && (
                    <div className="my-4 w-100 h-0.5 rounded-sm bg-gray" />
                  )}
                  <NavSection posts={v} root={join(root, k)} path={path} />
                </>
              );
            })) || <NavSection posts={posts} root={root} path={path} />}
        </nav>
          <div className="mr-10 my-4 w-0.5 h-100 rounded-sm bg-gray" />
      </div>
      <div className="flex-1 min-w-0">
        <TableOfContents key={params.slug?.join("/") || Math.random()} />
        <div className="w-full overflow-y-scroll">
          <h1 className="text-6xl text-white font-semibold mb-10">
            {data.title}
          </h1>
          <div className="markdown technical">
            <Markdown.render content={JSON.parse(markdown)} />
          </div>
          <div className="flex justify-between items-center mt-16">
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
    Markdown.parse({ post: { content: String.raw`${content}` } })
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
