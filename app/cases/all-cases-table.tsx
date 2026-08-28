"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChoicePill } from "../choice-pill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ALL_CASES_COLUMNS,
  displayCaseValue,
  isAllCasesPillKey,
  type AllCasesColumnKey,
  type AllCasesRow,
} from "@/lib/cases";

function defaultVisibility(): Record<AllCasesColumnKey, boolean> {
  return Object.fromEntries(
    ALL_CASES_COLUMNS.map((column) => [column.key, true]),
  ) as Record<AllCasesColumnKey, boolean>;
}

export function AllCasesTable({ rows }: { rows: AllCasesRow[] }) {
  const [visible, setVisible] = useState(defaultVisibility);

  const columns = useMemo(
    () => ALL_CASES_COLUMNS.filter((column) => visible[column.key]),
    [visible],
  );

  function toggleColumn(key: AllCasesColumnKey) {
    setVisible((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant="secondary" className="font-mono font-normal">
          {rows.length} {rows.length === 1 ? "case" : "cases"}
        </Badge>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              Filter / Columns
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Columns</SheetTitle>
              <SheetDescription>
                Default-on columns. Hide any of them.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-2 px-4">
              {ALL_CASES_COLUMNS.map((column) => (
                <Label
                  key={column.key}
                  htmlFor={`all-cases-col-${column.key}`}
                  className="cursor-pointer font-normal"
                >
                  <Checkbox
                    id={`all-cases-col-${column.key}`}
                    checked={visible[column.key]}
                    onCheckedChange={() => toggleColumn(column.key)}
                  />
                  {column.label}
                </Label>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption className="sr-only">All cases</TableCaption>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead
                scope="col"
                aria-label="Row number"
                className="w-12 text-center text-muted-foreground"
              >
                #
              </TableHead>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  scope="col"
                  className="text-muted-foreground"
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="py-10 text-center text-muted-foreground"
                >
                  No cases.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell className="text-center align-top font-mono text-xs text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  {columns.map((column) => {
                    const text = displayCaseValue(row[column.key]);
                    return (
                      <TableCell
                        key={column.key}
                        className="align-top text-foreground"
                      >
                        {column.key === "case_number" ? (
                          <Link
                            href={`/cases/${row.id}`}
                            className="text-primary underline-offset-2 hover:underline"
                          >
                            {text || row.id}
                          </Link>
                        ) : isAllCasesPillKey(column.key) && text ? (
                          <ChoicePill value={text} field={column.key} />
                        ) : (
                          text
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
