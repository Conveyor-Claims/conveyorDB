"use client";

import { useEffect, useState } from "react";
import { ChoicePill } from "../../choice-pill";
import { CaseSectionPanel } from "../[id]/case-sections";
import {
  CASE_SELECT_OPTIONS,
  defaultCreateNextStepName,
  selectedCreateNextStepNames,
} from "@/lib/select-options";

const OPTIONS = CASE_SELECT_OPTIONS.next_steps;

export function CreateCaseNextSteps({
  initialSelected,
  onSelectedChange,
}: {
  initialSelected?: readonly string[] | null;
  onSelectedChange?: (names: string[]) => void;
} = {}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(() =>
    selectedCreateNextStepNames(initialSelected),
  );

  useEffect(() => {
    onSelectedChange?.(selected);
  }, [onSelectedChange, selected]);

  function toggle(name: string, checked: boolean) {
    setSelected((prev) => {
      if (checked) return prev.includes(name) ? prev : [...prev, name];
      const next = prev.filter((item) => item !== name);
      return next.length > 0 ? next : [defaultCreateNextStepName()];
    });
  }

  const summary = (
    <ul className="flex flex-wrap gap-1.5">
      {selected.map((name) => (
        <li key={name}>
          <ChoicePill value={name} field="next_steps" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-0">
      <input type="hidden" name="next_steps" value="" />
      {selected.map((name) => (
        <input key={name} type="hidden" name="next_steps" value={name} />
      ))}
      <CaseSectionPanel
        name="Next Steps"
        anchor="next-steps"
        open={open}
        onToggle={() => setOpen((value) => !value)}
        collapsedSummary={summary}
      >
        <fieldset className="space-y-2 px-4 py-3">
          <legend className="sr-only">Next Steps</legend>
          <ul className="max-h-64 space-y-1.5 overflow-y-auto">
            {OPTIONS.map((option) => (
              <li key={option.name}>
                <label className="flex cursor-pointer items-center gap-2 rounded-[12px] px-1 py-0.5 hover:bg-wash">
                  <input
                    type="checkbox"
                    checked={selected.includes(option.name)}
                    onChange={(event) =>
                      toggle(option.name, event.target.checked)
                    }
                  />
                  <ChoicePill value={option.name} field="next_steps" />
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      </CaseSectionPanel>
    </div>
  );
}
