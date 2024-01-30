import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";

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

const getHeadings = (md) =>
  md.children.filter((e) => ["h2", "h3"].includes(e.name));

const cleanupHeadings = (headings) =>
  headings.map((h) => ({
    id: h.attributes?.id,
    innerText: getInnerText(h),
    nodeName: h.name?.toUpperCase(),
  }));

const getNestedHeadings = (headingElements) => {
  const nestedHeadings = [];

  headingElements.forEach((heading, index) => {
    const { innerText: title, id } = heading;

    if (heading.nodeName === "H2") {
      nestedHeadings.push({ id, title, items: [] });
    } else if (heading.nodeName === "H3" && nestedHeadings.length > 0) {
      nestedHeadings[nestedHeadings.length - 1].items.push({
        id,
        title,
      });
    }
  });

  return nestedHeadings;
};

export default function FragmentNav({ markdown }) {
  const nestedHeadings = getNestedHeadings(
    cleanupHeadings(getHeadings(markdown))
  );
  const [activeId, setActiveId] = useState();
  const isHidden =
    (nestedHeadings.length === 1 && nestedHeadings?.[0]?.items?.length === 0) ||
    nestedHeadings.length === 0;

  useIntersectionObserver(setActiveId);

  return (
    <nav
      className={classNames(
        "flex flex-col flex-1 offset-l overflow-y-auto overflow-x-hidden",
        {
          hidden: isHidden,
        }
      )}
    >
      {nestedHeadings.map((heading, index) => (
        <>
          <ul className="flex flex-col" key={heading.id}>
            <li>
              <a
                className={classNames("body-sm", {
                  "text-gray hover:text-brite": !(heading.id === activeId),
                  "text-brite": heading.id === activeId,
                })}
                href={`#${heading.id}`}
              >
                {heading.title}
              </a>
              {heading.items.length > 0 && (
                <ul className="flex flex-col">
                  {heading.items.map((child) => (
                    <a
                      className={classNames("pl-2.5 xl:pl-3.5 body-sm", {
                        "text-gray hover:text-brite": !(child.id === activeId),
                        "text-brite": child.id === activeId,
                      })}
                      href={`#${child.id}`}
                      key={child.id}
                    >
                      {child.title}
                    </a>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </>
      ))}
    </nav>
  );
}

const useIntersectionObserver = (setActiveId) => {
  const headingElementsRef = useRef({});
  useEffect(() => {
    const callback = (headings) => {
      headingElementsRef.current = headings.reduce((map, headingElement) => {
        map[headingElement.target.id] = headingElement;
        return map;
      }, headingElementsRef.current);

      const visibleHeadings = [];
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key];
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
      });

      const getIndexFromId = (id) =>
        headingElements.findIndex((heading) => heading.id === id);

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndexFromId(a.target.id) > getIndexFromId(b.target.id)
        );
        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "-64px 0px -50% 0px",
      threshold: 0.5,
    });

    const headingElements = Array.from(document.querySelectorAll("h2, h3"));

    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [setActiveId]);
};
