# Staff chrome and design

Shared shell so lists, boards, login, health, and the case page look like one staff app. Visual tokens follow the existing Airtable look-alike (P21): dest columns and catalog titles only.

## Responsibilities

- Left nav: Pipelines (All Cases + status queues) and Boards (due-date slugs that have a dest column).
- Account chip: “Temporary admin” / “Temporary paralegal”. Sign out.
- Admin-only links: Create case, Permissions.
- Wide list layout, title accessory, optional case header strip, optional right rail (comments).
- Loading skeletons and in-chrome missing/404 pages (Back to All Cases).
- Choice pills for stored Case Status, Department, Claim State, Resolutions Specialist, Paralegal, Next Steps, Insurance Company — tokens in `airtable-choice-colors.ts` / `select-options.ts`.

Signed-out home is **not** a pipeline chip grid.

## Visual tokens

`app/globals.css` keeps a light staff surface even when the OS is in dark mode (`--background: #ffffff`, accent `#1b61c9`). Do not treat dark-mode inversion as a product theme.

Fonts: Geist / Geist Mono via `app/layout.tsx`.

## Key files

| File | Role |
| --- | --- |
| `app/staff-chrome.tsx` | Server wrapper: session → nav flags |
| `app/staff-shell.tsx` | Layout frame |
| `app/staff-nav.tsx` | Client nav |
| `src/lib/staff-nav.ts` | Active path helpers |
| `app/staff-skeletons.tsx`, `staff-missing.tsx` | Loading / missing |
| `app/choice-pill.tsx` | Status / choice pills + nav dots |
| `src/lib/airtable-choice-colors.ts` | Live Airtable palette tokens |
| `src/lib/select-options.ts` | Dest option lists (truncated lists stay truncated) |
| `app/globals.css` | Colors, cases table scrollbar |
| `app/cases/[id]/case-header-strip.tsx` | DOL, Insurance Co., Claim No. |

## Related

List behavior: [cases.md](cases.md). Auth chips: [auth-permissions.md](auth-permissions.md).
