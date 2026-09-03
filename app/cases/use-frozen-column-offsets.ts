"use client";

import { useLayoutEffect, type RefObject } from "react";

/**
 * Measure the leftmost frozen cells so later sticky columns sit flush
 * against the ones before them. `#` is slot 0; Case Number / Client Name
 * follow when they are visible.
 */
export function useFrozenColumnOffsets(
  tableRef: RefObject<HTMLTableElement | null>,
  freezeCount: number,
) {
  useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    const apply = () => {
      const headerRow = table.tHead?.rows[0];
      if (!headerRow) return;
      let left = 0;
      for (let i = 0; i < freezeCount; i += 1) {
        table.style.setProperty(`--cases-freeze-left-${i}`, `${left}px`);
        const cell = headerRow.cells[i];
        if (!cell) break;
        left += cell.getBoundingClientRect().width;
      }
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(table);
    const headerRow = table.tHead?.rows[0];
    if (headerRow) {
      for (let i = 0; i < freezeCount; i += 1) {
        const cell = headerRow.cells[i];
        if (cell) observer.observe(cell);
      }
    }
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [freezeCount, tableRef]);
}
