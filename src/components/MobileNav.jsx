import React, { useState, useEffect, useRef } from "react";

export default function MobileNav({ children, nav }) {
  const [isOpen, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
    return () => (document.body.style.overflow = "visible");
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickListener);
    return () => {
      document.removeEventListener("mousedown", handleClickListener);
    };
  }, []);

  const handleClickListener = (event) => {
    if (ref && ref.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <div
      className="sticky top-[3rem] md:top-[4rem] z-40 flex flex-col h-12 md:h-16 w-full xl:hidden bg-black"
      ref={ref}
    >
      <div className="relative flex flex-1 w-full justify-between items-center whitespace-nowrap type-ui">
        <div className="flex flex-1 flex-row-reverse items-center h-full bg-tint overflow-x-auto pl-5">
          <div className="flex-1 space-x-1.5">{children}</div>
        </div>
        <button
          className="flex items-center justify-center w-14 h-full bg-tint text-brite hover:opacity-80"
          onClick={() => setOpen(!isOpen)}
        >
          {isOpen ? "↑" : "↓"}
        </button>
      </div>
      {isOpen && (
        <div className="absolute bg-black top-full w-full pt-3.5 pb-32 overflow-y-auto z-30 pl-5 h-content">
          {nav}
        </div>
      )}
    </div>
  );
}
