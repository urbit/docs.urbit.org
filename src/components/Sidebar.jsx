import React from "react";
import classnames from "classnames";
import { Sidebar as SidebarFDN } from "@urbit/fdn-design-system";

export default function Sidebar({
  className = "",
  children,
  left = false,
  right = false,
}) {
  return (
    <SidebarFDN
      className={classnames(
        "sticky top-12 md:top-16 z-40 py-5 sidebar",
        className
      )}
      left={left}
      right={right}
    >
      {children}
    </SidebarFDN>
  );
}
