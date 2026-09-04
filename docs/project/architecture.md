# Architecture

Boxes are **modules that exist in this repo**. Arrows are control or data flow as implemented today. This is not a target-state diagram.

White / light fills so the chart stays readable on GitHub’s default background.

## Excalidraw (system context)

Clean white-background export for non-engineers. Same highest-level flow as the Mermaid below: staff cookie vs sister-app Bearer, five cabinets on primary, files in `case-files`, backup replica of tables only.

[![ConveyorDB system context](diagrams/conveyordb-system-context.png)](diagrams/conveyordb-system-context.png)

- PNG: [`diagrams/conveyordb-system-context.png`](diagrams/conveyordb-system-context.png)
- Editable scene (Excalidraw v2, roughness 0): [`diagrams/conveyordb-system-context.excalidraw`](diagrams/conveyordb-system-context.excalidraw)

## System context (Mermaid)

```mermaid
flowchart TB
  subgraph callers["Callers"]
    Staff["Staff browser"]
    Intake["Intake / Coworking sister apps"]
    Cron["Vercel Cron every 4 hours UTC"]
  end

  subgraph vercel["Vercel project conveyor-db"]
    UI["Staff UI app pages"]
    API["HTTP API five cabinets"]
    BackupRoute["Backup route /api/cron/backup"]
  end

  subgraph primary["Supabase primary conveyordb-testing"]
    Cabinets["P11 cabinets: cases contacts partners next_steps files"]
    High["P12 High tables: comments used by UI; others schema-only"]
    Grants["P25 grants: role_permissions, case_view_grants"]
    Storage["Storage bucket case-files private"]
  end

  subgraph replica["Supabase backup conveyordb-backup"]
    BackupTables["Same public tables - row replica"]
  end

  Staff -->|"cookie admin or paralegal - not an API token"| UI
  Intake -->|"Bearer SUPABASE_SERVICE_ROLE_KEY - cookie is not enough"| API
  Cron -->|"Bearer CRON_SECRET or x-vercel-cron"| BackupRoute

  UI --> Cabinets
  UI --> High
  UI --> Grants
  UI --> Storage
  API --> Cabinets
  API --> Storage
  BackupRoute -->|"upsert + delete extras; no SQL; no Storage objects"| BackupTables
  Cabinets -.->|"source rows"| BackupRoute
  High -.-> BackupRoute
  Grants -.-> BackupRoute

  style Staff fill:#ffffff,stroke:#334155,color:#0f172a
  style Intake fill:#ffffff,stroke:#334155,color:#0f172a
  style Cron fill:#ffffff,stroke:#334155,color:#0f172a
  style UI fill:#eff6ff,stroke:#1d4ed8,color:#0f172a
  style API fill:#eff6ff,stroke:#1d4ed8,color:#0f172a
  style BackupRoute fill:#eff6ff,stroke:#1d4ed8,color:#0f172a
  style Cabinets fill:#f0fdf4,stroke:#15803d,color:#0f172a
  style High fill:#f8fafc,stroke:#64748b,color:#0f172a
  style Grants fill:#f0fdf4,stroke:#15803d,color:#0f172a
  style Storage fill:#f0fdf4,stroke:#15803d,color:#0f172a
  style BackupTables fill:#fff7ed,stroke:#c2410c,color:#0f172a
```

## Staff UI modules

```mermaid
flowchart LR
  Chrome["Staff chrome: nav, shell, pills"]
  Lists["Cases lists: All Cases, pipelines"]
  Boards["Due-date boards /boards"]
  Create["Create case /cases/new"]
  Detail["Case page /cases/id"]
  People["Contacts on case"]
  Chat["Comments rail"]
  Slots["File slots"]
  Steps["Next step claim"]
  Perms["Permissions admin only"]

  Chrome --> Lists
  Chrome --> Boards
  Chrome --> Create
  Chrome --> Detail
  Chrome --> Perms
  Detail --> People
  Detail --> Chat
  Detail --> Slots
  Detail --> Steps
  Lists -->|"row click"| Detail
  Boards -->|"row click"| Detail
  Create -->|"insert cases + next_steps"| Detail

  style Chrome fill:#ffffff,stroke:#334155,color:#0f172a
  style Lists fill:#eff6ff,stroke:#1d4ed8,color:#0f172a
  style Boards fill:#eff6ff,stroke:#1d4ed8,color:#0f172a
  style Create fill:#eff6ff,stroke:#1d4ed8,color:#0f172a
  style Detail fill:#eff6ff,stroke:#1d4ed8,color:#0f172a
  style People fill:#f0fdf4,stroke:#15803d,color:#0f172a
  style Chat fill:#f0fdf4,stroke:#15803d,color:#0f172a
  style Slots fill:#f0fdf4,stroke:#15803d,color:#0f172a
  style Steps fill:#f0fdf4,stroke:#15803d,color:#0f172a
  style Perms fill:#ffffff,stroke:#334155,color:#0f172a
```

## Write paths (who may change a row)

```mermaid
sequenceDiagram
  participant Staff as Staff admin
  participant Page as Case page / create
  participant API as /api cabinets
  participant Sister as Intake or Coworking
  participant DB as public.cases and children

  Staff->>Page: cookie session admin
  Page->>DB: insert or UPDATE dest columns
  Note over Page,DB: cases UPDATE matches last_modified unless overwrite
  Sister->>API: Bearer service role
  API->>DB: same dest columns
  Note over Sister,DB: First test is PATCH Natalie C-02895 only
```

## File slot rule

A filled slot (`same case_id` + `slot_name` and a non-empty `storage_path`) is **409**. The first `case-files` object is not replaced or deleted. There is **no** unique index on `(case_id, slot_name)` — do not add one.

```mermaid
flowchart TD
  Upload["POST /api/files multipart or staff upload"]
  Check{"Row already has storage_path for this slot?"}
  Refuse["409 filled - first object stays"]
  Insert["Insert files row, upload to case-files, set storage_path"]

  Upload --> Check
  Check -->|yes| Refuse
  Check -->|no| Insert

  style Upload fill:#ffffff,stroke:#334155,color:#0f172a
  style Check fill:#eff6ff,stroke:#1d4ed8,color:#0f172a
  style Refuse fill:#fff7ed,stroke:#c2410c,color:#0f172a
  style Insert fill:#f0fdf4,stroke:#15803d,color:#0f172a
```

## What is not in this picture

These are easy to assume and **are not** modules here:

- No Intake form, Google/Dropbox pickers, or `intake_submissions` tables.
- No Airtable dual-write from the Next.js app. Copy scripts are dry-run only.
- No dedicated staff pages for the Contact, Partner, Next Step, or File cabinets.
- No live collaboration. Conflicts are optimistic (`last_modified` / `updated_at`).
- Backup does not copy Storage objects and does not apply SQL.

See [README.md](README.md) for the module index.
