import Link from "next/link";
import { StaffChrome } from "../staff-chrome";

export const metadata = {
  title: "Staff sign in · ConveyorDB",
  description: "Staff Google login stub.",
};

export default function LoginPage() {
  return (
    <StaffChrome title="Staff sign in">
      <p className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        Google sign-in is not connected in this revision. This page is a stub
        so staff routing can land here later.
      </p>
      <div className="max-w-sm space-y-3">
        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
        >
          <GoogleMark />
          Continue with Google
        </button>
        <p className="text-xs text-zinc-500">Staff Google login stub.</p>
        <Link
          href="/cases"
          className="inline-block text-sm text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
        >
          All Cases
        </Link>
      </div>
    </StaffChrome>
  );
}

function GoogleMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 18 18"
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}
