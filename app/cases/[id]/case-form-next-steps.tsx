"use client";

import { useCallback, useEffect, useMemo } from "react";
import { CreateCaseNextSteps } from "../new/create-case-next-steps";
import { selectedCreateNextStepNames } from "@/lib/select-options";
import { useFieldDirty } from "./case-form";

export function CaseFormNextSteps({
  initialSelected,
}: {
  initialSelected: readonly string[] | null;
}) {
  const { setFieldDirty } = useFieldDirty();
  const baseline = useMemo(
    () => selectedCreateNextStepNames(initialSelected).join("\u0001"),
    [initialSelected],
  );

  useEffect(() => {
    return () => setFieldDirty("next_steps", false);
  }, [setFieldDirty]);

  const onSelectedChange = useCallback(
    (names: string[]) => {
      setFieldDirty("next_steps", names.join("\u0001") !== baseline);
    },
    [baseline, setFieldDirty],
  );

  return (
    <CreateCaseNextSteps
      initialSelected={initialSelected}
      onSelectedChange={onSelectedChange}
    />
  );
}
