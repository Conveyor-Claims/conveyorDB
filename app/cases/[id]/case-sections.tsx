"use client";

import { Children, useState, type ReactNode } from "react";

export type CaseSectionChrome = {
  name: string;
  anchor: string;
  defaultOpen: boolean;
};

export function CaseSections({
  sections,
  children,
}: {
  sections: readonly CaseSectionChrome[];
  children: ReactNode;
}) {
  const panels = Children.toArray(children);
  const [openNames, setOpenNames] = useState<string[]>(() =>
    sections.filter((section) => section.defaultOpen).map((section) => section.name),
  );

  function isOpen(name: string) {
    return openNames.includes(name);
  }

  function toggle(name: string) {
    setOpenNames((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  }

  function reveal(name: string) {
    setOpenNames((current) =>
      current.includes(name) ? current : [...current, name],
    );
  }

  return (
    <div className="space-y-4">
      <nav
        aria-label="Case sections"
        className="flex gap-1 overflow-x-auto border-b border-border pb-2"
      >
        {sections.map((section) => (
          <a
            key={section.anchor}
            href={`#${section.anchor}`}
            onClick={() => reveal(section.name)}
            className={`shrink-0 rounded-[12px] border border-border px-2.5 py-1 text-xs ${
              isOpen(section.name)
                ? "bg-wash text-accent"
                : "bg-background text-muted hover:bg-wash hover:text-accent"
            }`}
          >
            {section.name}
          </a>
        ))}
      </nav>

      <div className="space-y-3">
        {sections.map((section, index) => {
          const open = isOpen(section.name);
          return (
            <section
              key={section.anchor}
              id={section.anchor}
              className="scroll-mt-6 overflow-hidden rounded-xl border border-border bg-background"
            >
              <h2>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => toggle(section.name)}
                  className="flex w-full items-center justify-between bg-wash px-4 py-2.5 text-left text-sm font-medium text-foreground"
                >
                  <span>{section.name}</span>
                  <span aria-hidden className="text-muted">
                    {open ? "▾" : "▸"}
                  </span>
                </button>
              </h2>
              {open ? panels[index] : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
