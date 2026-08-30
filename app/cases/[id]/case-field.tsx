"use client";

import { useEffect, useRef, useState } from "react";
import { isCaseNotesField, type CasePageField } from "@/lib/case-page";
import { displayCaseValue } from "@/lib/cases";
import type { UpdateCaseState } from "@/lib/case-save";
import { optionStyle, optionsForDest } from "@/lib/select-options";
import type { Database } from "@/lib/database.types";
import { ChoicePill } from "../../choice-pill";
import {
  LOADED_LAST_MODIFIED_FIELD,
  OVERWRITE_FIELD,
} from "@/lib/case-concurrency";
import { updateCaseAction } from "./actions";
import { FieldValue } from "./field-value";
import { ConflictActions, useFieldDirty } from "./case-form";

type CasesRow = Database["public"]["Tables"]["cases"]["Row"];

function inputClass(dirty: boolean, extra = "") {
  return [
    "w-full rounded-[12px] border px-3 py-2 text-sm text-foreground",
    dirty ? "border-amber-400 bg-amber-50" : "border-border bg-background",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

function asStringList(value: CasesRow[keyof CasesRow]): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value.map(String).filter((item) => item.length > 0);
  }
  const text = String(value).trim();
  return text ? [text] : [];
}

function dateInputValue(value: CasesRow[keyof CasesRow]): string {
  const text = displayCaseValue(value);
  const match = text.match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? "";
}

function dateTimeInputValue(value: CasesRow[keyof CasesRow]): string {
  const text = displayCaseValue(value);
  const match = text.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
  return match?.[1] ?? text;
}

function DirtyHint({ dirty }: { dirty: boolean }) {
  if (!dirty) return null;
  return <p className="mt-1 text-xs text-amber-800">Unsaved</p>;
}

function TextControl({
  field,
  initial,
  multiline = false,
  inputType = "text",
}: {
  field: CasePageField;
  initial: string;
  multiline?: boolean;
  inputType?: string;
}) {
  const { setFieldDirty } = useFieldDirty();
  const [value, setValue] = useState(initial);
  const dirty = value !== initial;

  useEffect(() => {
    setFieldDirty(field.key, dirty);
    return () => setFieldDirty(field.key, false);
  }, [dirty, field.key, setFieldDirty]);

  const id = `case-field-${field.key}`;

  if (multiline) {
    return (
      <div>
        <textarea
          id={id}
          name={field.key}
          value={value}
          rows={4}
          onChange={(event) => setValue(event.target.value)}
          className={inputClass(dirty, "min-h-28")}
        />
        <DirtyHint dirty={dirty} />
      </div>
    );
  }

  return (
    <div>
      <input
        id={id}
        type={inputType}
        name={field.key}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className={inputClass(dirty)}
      />
      <DirtyHint dirty={dirty} />
    </div>
  );
}

function NotesAutosave({
  field,
  initial,
  caseId,
}: {
  field: CasePageField;
  initial: string;
  caseId: string;
}) {
  const { setFieldDirty, loadedLastModified, setLoadedLastModified } =
    useFieldDirty();
  const [value, setValue] = useState(initial);
  const [status, setStatus] = useState<UpdateCaseState | null>(null);
  const [pending, setPending] = useState(false);
  const savedRef = useRef(initial);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedRef = useRef(loadedLastModified);
  loadedRef.current = loadedLastModified;
  const dirty = value !== savedRef.current;

  useEffect(() => {
    setFieldDirty(field.key, dirty);
    return () => setFieldDirty(field.key, false);
  }, [dirty, field.key, setFieldDirty]);

  async function persist(next: string, overwrite = false) {
    if (next === savedRef.current && !overwrite) return;
    const formData = new FormData();
    formData.set("caseRowId", caseId);
    formData.set(field.key, next);
    formData.set(LOADED_LAST_MODIFIED_FIELD, loadedRef.current);
    if (overwrite) formData.set(OVERWRITE_FIELD, "true");
    setPending(true);
    const result = await updateCaseAction(null, formData);
    setPending(false);
    setStatus(result);
    if (result.ok) {
      savedRef.current = next;
      setFieldDirty(field.key, false);
      if (result.lastModified !== undefined) {
        setLoadedLastModified(result.lastModified ?? "");
      }
    }
  }

  function schedule(next: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void persist(next);
    }, 800);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const id = `case-field-${field.key}`;

  return (
    <div>
      <textarea
        id={id}
        name={field.key}
        value={value}
        rows={12}
        onChange={(event) => {
          const next = event.target.value;
          setValue(next);
          setStatus(null);
          schedule(next);
        }}
        onBlur={() => {
          if (timerRef.current) clearTimeout(timerRef.current);
          void persist(value);
        }}
        className={inputClass(dirty, "min-h-56")}
      />
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {status && !status.ok && status.conflict ? (
          <ConflictActions onOverwrite={() => void persist(value, true)} />
        ) : null}
        <p
          role="status"
          aria-live="polite"
          className={`text-xs ${
            status?.ok
              ? "text-emerald-700"
              : status
                ? "text-red-800"
                : dirty
                  ? "text-amber-800"
                  : "text-muted"
          }`}
        >
          {pending
            ? "Saving…"
            : (status?.message ?? (dirty ? "Unsaved" : ""))}
        </p>
      </div>
    </div>
  );
}

function SingleSelectControl({
  field,
  selected,
}: {
  field: CasePageField;
  selected: string;
}) {
  const { setFieldDirty } = useFieldDirty();
  const copied = optionsForDest(field.key) ?? [];
  const options =
    copied.some((option) => option.name === selected) || !selected
      ? copied
      : [{ name: selected }, ...copied];
  const [value, setValue] = useState(selected);
  const dirty = value !== selected;

  useEffect(() => {
    setFieldDirty(field.key, dirty);
    return () => setFieldDirty(field.key, false);
  }, [dirty, field.key, setFieldDirty]);

  const id = `case-field-${field.key}`;
  const colors = optionStyle(field.key, value);

  return (
    <div className="space-y-2">
      <select
        id={id}
        name={field.key}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className={inputClass(dirty, colors ? "rounded-full font-medium" : "")}
        style={
          dirty || !colors
            ? undefined
            : {
                backgroundColor: colors.backgroundColor,
                color: colors.color,
                borderColor: colors.borderColor,
              }
        }
      >
        <option value=""></option>
        {options.map((option) => (
          <option key={option.name} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
      {value ? <ChoicePill value={value} field={field.key} /> : null}
      <DirtyHint dirty={dirty} />
    </div>
  );
}

function MultiSelectControl({
  field,
  selected,
}: {
  field: CasePageField;
  selected: string[];
}) {
  const { setFieldDirty } = useFieldDirty();
  const copied = optionsForDest(field.key) ?? [];
  const extras = selected.filter(
    (name) => !copied.some((option) => option.name === name),
  );
  const options = [
    ...extras.map((name) => ({ name })),
    ...copied,
  ];
  const initial = selected.join("\u0001");
  const [current, setCurrent] = useState<string[]>(selected);
  const dirty = current.join("\u0001") !== initial;

  useEffect(() => {
    setFieldDirty(field.key, dirty);
    return () => setFieldDirty(field.key, false);
  }, [dirty, field.key, setFieldDirty]);

  function toggle(name: string, checked: boolean) {
    setCurrent((prev) => {
      if (checked) return prev.includes(name) ? prev : [...prev, name];
      return prev.filter((item) => item !== name);
    });
  }

  return (
    <fieldset id={`case-field-${field.key}`} className="space-y-2">
      <legend className="sr-only">{field.label}</legend>
      <input type="hidden" name={field.key} value="" />
      <ul className="space-y-1.5">
        {options.map((option) => (
          <li key={option.name}>
            <label className="flex cursor-pointer items-center gap-2 rounded-[12px] px-1 py-0.5 hover:bg-wash">
              <input
                type="checkbox"
                name={field.key}
                value={option.name}
                checked={current.includes(option.name)}
                onChange={(event) => toggle(option.name, event.target.checked)}
              />
              <ChoicePill value={option.name} field={field.key} />
            </label>
          </li>
        ))}
      </ul>
      <DirtyHint dirty={dirty} />
    </fieldset>
  );
}

export function CaseField({
  field,
  value,
  caseId,
}: {
  field: CasePageField;
  value: CasesRow[keyof CasesRow];
  caseId: string;
}) {
  const id = `case-field-${field.key}`;

  let control;
  if (field.fieldType === "formula") {
    control = <FieldValue field={field} value={value} />;
  } else if (field.fieldType === "checkbox") {
    control = (
      <span className="inline-flex items-center gap-2">
        <input type="hidden" name={field.key} value="" />
        <input
          id={id}
          type="checkbox"
          name={field.key}
          value="true"
          defaultChecked={value === true}
          aria-label={field.label}
          className="mt-1"
        />
      </span>
    );
  } else if (field.fieldType === "dropdown" && optionsForDest(field.key)) {
    control = (
      <SingleSelectControl field={field} selected={displayCaseValue(value)} />
    );
  } else if (field.fieldType === "multi dropdown" && optionsForDest(field.key)) {
    control = (
      <MultiSelectControl field={field} selected={asStringList(value)} />
    );
  } else if (isCaseNotesField(field.key)) {
    control = (
      <NotesAutosave
        field={field}
        initial={displayCaseValue(value)}
        caseId={caseId}
      />
    );
  } else if (
    field.fieldType === "long text" ||
    field.fieldType === "rich text"
  ) {
    control = (
      <TextControl field={field} initial={displayCaseValue(value)} multiline />
    );
  } else if (field.fieldType === "date") {
    control = (
      <TextControl
        field={field}
        initial={dateInputValue(value)}
        inputType="date"
      />
    );
  } else if (field.fieldType === "date/time") {
    const raw = displayCaseValue(value);
    const hasTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(raw);
    const dateOnly = dateInputValue(value);
    control = (
      <TextControl
        field={field}
        initial={hasTime ? dateTimeInputValue(value) : raw}
        inputType={
          hasTime ? "datetime-local" : dateOnly && raw === dateOnly ? "date" : "text"
        }
      />
    );
  } else if (field.fieldType === "money" || field.fieldType === "percent") {
    control = (
      <TextControl field={field} initial={displayCaseValue(value)} />
    );
  } else {
    control = (
      <TextControl
        field={field}
        initial={displayCaseValue(value)}
        inputType={
          field.fieldType === "email"
            ? "email"
            : field.fieldType === "url"
              ? "url"
              : "text"
        }
      />
    );
  }

  return (
    <div className="grid gap-1 border-t border-border py-3 first:border-t-0 sm:grid-cols-[minmax(12rem,14rem)_1fr] sm:gap-6">
      <dt className="text-sm text-muted">
        <label htmlFor={id}>{field.label}</label>
      </dt>
      <dd className="min-w-0 text-sm text-foreground">{control}</dd>
    </div>
  );
}
