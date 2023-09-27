import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";

export const TableOfContents = ({ staticPosition, noh3s, markdown = true }) => {
  const { headings } = useHeadingsData(noh3s, markdown);
  const [activeId, setActiveId] = useState();
  const isHidden = headings.length === 1 && headings?.[0]?.items?.length === 0;

  useIntersectionObserver(setActiveId);

  return (
    <div
      className={classNames("sticky top-16 z-40 bg-black", {
        "mt-5": isHidden,
        "pt-5": !isHidden,
      })}
    >
      <nav
        className={classNames(
          "w-full flex whitespace-nowrap space-x-4 overflow-x-scroll pb-5",
          {
            hidden: isHidden,
          }
        )}
      >
        {headings.map((heading, index) => (
          <ul className="flex nav-space-x" key={heading.id}>
            <li className="flex nav-space-x">
              <a
                className={classNames("font-semibold text-gray type-ui", {
                  "text-brite": heading.id === activeId && index !== 0,
                })}
                href={`#${heading.id}`}
              >
                {heading.title}
              </a>
              {heading.items.length > 0 && (
                <ul className="flex nav-space-x">
                  {heading.items.map((child) => (
                    <a
                      className={
                        "text-gray type-ui " +
                        (child.id === activeId ? "text-brite" : "text-gray")
                      }
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
        ))}
      </nav>
      {!isHidden && <div className="w-full mb-6 h-0.5 rounded-sm bg-gray" />}
    </div>
  );
};

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

const useHeadingsData = (noh3s, markdown) => {
  const [headings, setHeadings] = useState([]);

  const md = markdown ? ".markdown" : "";
  const query = noh3s ? `${md} h2` : `${md} h2, ${md} h3`;

  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll(query));

    const newHeadings = getNestedHeadings(headingElements);
    setHeadings(newHeadings);
  }, []);

  return { headings };
};

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
      rootMargin: "0px 0px -50% 0px",
    });

    const headingElements = Array.from(document.querySelectorAll("h2, h3"));

    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [setActiveId]);
};

export default TableOfContents;
