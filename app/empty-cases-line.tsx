import Link from "next/link";

export function EmptyCasesLine({
  showViewAll = false,
}: {
  showViewAll?: boolean;
}) {
  return (
    <p className="text-sm leading-6 text-muted">
      No cases in this list.
      {showViewAll ? (
        <>
          {" "}
          <Link href="/cases" className="text-accent hover:text-accent-hover">
            View All Cases
          </Link>
        </>
      ) : null}
    </p>
  );
}
