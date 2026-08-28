import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StaffChrome } from "../../staff-chrome";

export default function CaseNotFound() {
  return (
    <StaffChrome title="Case not found">
      <p className="text-sm leading-6 text-muted-foreground">
        No row on <span className="font-mono">public.cases</span> matches this
        id.
      </p>
      <Button asChild variant="link" className="h-auto px-0 font-mono">
        <Link href="/cases">All Cases</Link>
      </Button>
    </StaffChrome>
  );
}
