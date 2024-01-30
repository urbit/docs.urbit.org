import React from "react";
import classnames from "classnames";

export default function Sidebar({
  className = "",
  children,
  left = false,
  right = false,
}) {
  return (
    <div
      className={classnames(
        "sticky top-12 md:top-16 z-40 py-5 sidebar",
        "flex overflow-x-hidden overflow-y-auto",
        {
          "border-l rounded-sm border-gray": right,
          "border-r rounded-sm border-gray": left,
        },
        className
      )}
    >
      {children}
    </div>
  );
}
