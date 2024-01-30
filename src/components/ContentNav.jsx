import React, { useState } from "react";
import Link from "next/link";
import classnames from "classnames";
import { join } from "path";

function label(str, maxLen) {
  return str.length > maxLen ? str.slice(0, maxLen - 2).trim() + "..." : str;
}

function sort(index) {
  const sortBy = index["sort_by"] || "weight";
  return (l, r) => {
    return (l[sortBy] || 0) - (r[sortBy] || 0);
  };
}

function NavItem({
  type,
  level = 0,
  label,
  href,
  path,
  isUnderThis,
  collapsed,
  isOpen,
  setOpen,
  alignSig,
}) {
  const isOnThis = path === href;
  const padding = classnames({
    "pl-2.5 xl:pl-3.5": level === 1,
    "pl-5 xl:pl-7": level === 2,
    "pl-[1.875rem] xl:pl-[2.625rem]": level === 3,
    "pl-10 xl:pl-14": level === 4,
  });
  const sigAlignment = alignSig ? "pl-1.5 lg:pl-4 xl:pl-5" : "";
  const color = (b) => {
    return {
      "text-gray hover:text-brite": !b,
      "text-brite": b,
    };
  };

  if (type === "dir" && level < 0) {
    return (
      <Link
        className={classnames(
          "flex justify-between body-sm",
          { "layout-pl": alignSig, "mb-2": isOpen && alignSig },
          color(isUnderThis)
        )}
        href={href}
        onClick={(e) => {
          if (path === href) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            setOpen(!isOpen);
          } else {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            setOpen(true);
          }
        }}
      >
        {label}
      </Link>
    );
  } else if (type === "dir" && level >= 0) {
    return (
      <Link
        className={classnames(
          "flex justify-between w-full body-sm",
          sigAlignment,
          color(isUnderThis)
        )}
        href={href}
        onClick={(e) => {
          if (path === href) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            setOpen(!isOpen);
          } else {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            setOpen(true);
          }
        }}
      >
        <span className={classnames(padding)}>{label}</span>
        <span
          className={!alignSig ? "flex items-center justify-center w-14" : ""}
        >
          {(isOpen && (alignSig ? "-" : "—")) ||
            (!isOpen && (alignSig ? "+" : "＋"))}
        </span>
      </Link>
    );
  }
  return (
    <Link
      className={classnames("flex body-sm", sigAlignment, color(isOnThis))}
      href={href}
    >
      <span className={classnames(padding)}>{label}</span>
    </Link>
  );
}

function NavSection({
  children,
  posts,
  root,
  path,
  level = -1,
  divider = false,
  alignSig = false,
}) {
  const isUnderThis = `${path}/`.includes(`${root}/`);
  const isUnderThisNotOn =
    `${path}/`.includes(`${root}/`) && `/${root}` !== path;
  const [isOpen, setOpen] = useState(posts.auto_expand || isUnderThis);

  return (
    <>
      {divider && (
        <div className={alignSig ? "ml-1.5 md:ml-3 lg:ml-4 xl:ml-5" : "mr-5"}>
          <hr className="hr-horizontal border-gray my-3.5" />
        </div>
      )}
      <NavItem
        type="dir"
        level={level}
        label={posts.title}
        href={`/${root}`}
        path={path}
        isUnderThis={isUnderThis}
        collapsed={!(posts.auto_expand || isUnderThis)}
        isOpen={isOpen}
        setOpen={setOpen}
        alignSig={alignSig}
      />
      {(isOpen || isUnderThisNotOn) &&
        posts.pages.sort(sort(posts)).map((page) => {
          const href = `/${root}/${page.slug}`;
          const isThisPage = path === href;
          return (
            <NavItem
              type="file"
              level={level + 1}
              label={page.title}
              href={`/${root}/${page.slug}`}
              path={path}
              isUnderThis={isUnderThis}
              collapsed={!(posts.auto_expand || isUnderThis)}
              alignSig={alignSig}
              key={href}
            />
          );
        })}
      {(isOpen || isUnderThisNotOn) &&
        posts.children &&
        Object.keys(posts.children).length !== 0 &&
        Object.entries(posts.children)
          .sort(sort(posts))
          .map(([k, v], i) => {
            return (
              <NavSection
                posts={v}
                root={join(root, k)}
                path={path}
                level={level + 1}
                alignSig={alignSig}
                key={join(root, k)}
              />
            );
          })}
    </>
  );
}

export default function ContentNav({
  posts,
  root,
  firstCrumb,
  mobile = false,
}) {
  return (
    <nav
      className={classnames(
        "flex flex-col w-full overflow-y-auto overflow-x-hidden",
        { "offset-r": !mobile }
      )}
    >
      {posts.pages.sort(sort(posts)).map((page) => {
        const href = `/${root}/${page.slug}`;
        return (
          <NavItem
            type="file"
            level={-1}
            label={page.title}
            href={href}
            path={firstCrumb}
            isUnderThis={`${firstCrumb}/`.includes(`${root}/`)}
            key={href}
            alignSig={!mobile}
          />
        );
      })}
      {posts.children &&
        Object.keys(posts.children).length !== 0 &&
        Object.entries(posts.children)
          .sort(sort(posts))
          .map(([k, v], i) => {
            return (
              <NavSection
                posts={v}
                root={join(root, k)}
                path={firstCrumb}
                key={"tray-" + join(root, k)}
                divider={i > 0 || posts.pages.length !== 0}
                alignSig={!mobile}
              />
            );
          })}
    </nav>
  );
}
