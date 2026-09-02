"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export function StickyHorizontalScroll({
  children,
  label,
  className,
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  const topRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);
  const [overflows, setOverflows] = useState(false);

  const measure = useCallback(() => {
    const body = bodyRef.current;
    const spacer = spacerRef.current;
    if (!body || !spacer) return;
    const width = body.scrollWidth;
    spacer.style.width = `${width}px`;
    setOverflows(width > body.clientWidth + 1);
  }, []);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    const table = body.querySelector("table");
    if (table) observer.observe(table);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  function syncFromTop() {
    if (syncing.current || !topRef.current || !bodyRef.current) return;
    syncing.current = true;
    bodyRef.current.scrollLeft = topRef.current.scrollLeft;
    syncing.current = false;
  }

  function syncFromBody() {
    if (syncing.current || !topRef.current || !bodyRef.current) return;
    syncing.current = true;
    topRef.current.scrollLeft = bodyRef.current.scrollLeft;
    syncing.current = false;
  }

  return (
    <div className={className}>
      <div
        ref={topRef}
        onScroll={syncFromTop}
        aria-label={label}
        className={
          overflows
            ? "cases-table-h-scroll sticky top-0 z-20 min-h-3 rounded-t-xl bg-background"
            : "invisible h-0 overflow-hidden"
        }
      >
        <div ref={spacerRef} className="h-px" />
      </div>
      <div
        ref={bodyRef}
        onScroll={syncFromBody}
        className="cases-table-h-scroll-body overflow-x-auto"
      >
        {children}
      </div>
    </div>
  );
}
