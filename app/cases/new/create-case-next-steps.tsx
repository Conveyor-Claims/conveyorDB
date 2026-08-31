"use client";

import { useState } from "react";
import { ChoicePill } from "../../choice-pill";
import { CaseSectionPanel } from "../[id]/case-sections";
import {
  CASE_SELECT_OPTIONS,
  defaultCreateNextStepName,
} from "@/lib/select-options";

const OPTIONS = CASE_SELECT_OPTIONS.next_steps;

export function CreateCaseNextSteps() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(() => [
    defaultCreateNextStepName(),
  ]);

  function toggle(name: string, checked: boolean) {
    setSelected((prev) => {
      if (checked) return prev.includes(name) ? prev : [...prev, name];
      return prev.filter((item) => item !== name);
    });
  }

  const summary =
    selected.length === 0 ? (
      <p className="text-sm text-muted">None selected</p>
    ) : (
      <ul className="flex flex-wrap gap-1.5">
        {selected.map((name) => (
          <li key={name}>
            <ChoicePill value={name} field="next_steps" />
          </li>
        ))}
      </ul>
    );

  return (
    <CaseSectionPanel
      name="Next Steps"
      anchor="next-steps"
      open={open}
      onToggle={() => setOpen((value) => !value)}
      collapsedSummary={summary}
    >
      <fieldset className="space-y-2 px-4 py-3">
        <legend className="sr-only">Next Steps</legend>
        <input type="hidden" name="next_steps" value="" />
        <ul className="max-h-64 space-y-1.5 overflow-y-auto">
          {OPTIONS.map((option) => (
            <li key={option.name}>
              <label className="flex cursor-pointer items-center gap-2 rounded-[12px] px-1 py-0.5 hover:bg-wash">
                <input
                  type="checkbox"
                  name="next_steps"
                  value={option.name}
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
  );
}
