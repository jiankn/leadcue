# LeadCue `/app` V2 Blueprint

## Objective

Reshape `/app` from an internal module map into a user-facing operating workflow.

The core product job is:

`turn a list of websites into qualified, export-ready accounts without losing website evidence`

This v2 blueprint is intentionally split into two phases:

- `v2-lite`
  Rework information architecture, routes, labels, and page composition using the current data model.
- `v2-full`
  Add a persistent server-side queue, a unified workflow state model, and export history entities.

## User Workflow

1. Set ICP
2. Add websites
3. Scan or review queued websites
4. Qualify accounts
5. Export to CRM or outreach workflow
6. Return to Today for the next bottleneck

## V2 Information Architecture

Primary navigation:

- `Today`
- `Queue`
- `Qualified`
- `Exports`
- `Settings`

Secondary route:

- `Workflow analytics`

### Route Map

- `/app` -> `Today`
- `/app/queue` -> `Queue`
- `/app/qualified` -> `Qualified`
- `/app/exports` -> `Exports`
- `/app/settings` -> `Settings`
- `/app/analytics` -> `Workflow analytics`

Backward-compatible aliases:

- `/app/import` -> `Queue`
- `/app/leads` -> `Queue`
- `/app/accounts` -> `Qualified`
- `/app/account` -> `Settings`
- `/app/billing` -> `Settings`
- `/app/settings/icp` -> `Settings`

## Page Responsibilities

### Today

Purpose:

- show the current next action
- show blockers
- show funnel progress at a glance

Must answer:

- What should I do next?
- What is blocked?
- Is work moving forward?

### Queue

Purpose:

- collect websites
- run the next scan
- review queued work

Includes:

- import intake
- queue summary
- manual scan lane
- review queue

### Qualified

Purpose:

- manage accounts that passed review
- assign owner and notes
- inspect prospect cards

Includes:

- filters
- selection
- prospect detail drawer

### Exports

Purpose:

- prepare CRM handoff
- export selected or all ready accounts
- make export status obvious

Includes:

- export preset selection
- CRM mode selection
- selected export
- all-ready export
- ready-for-export table

### Settings

Purpose:

- configure how work should run
- maintain workspace identity and access
- manage billing

Includes:

- ICP
- workspace profile
- password access
- workspace summary
- billing and plan details

## State Model

### V2-lite

Keep the current model, but present it through workflow pages.

- imported websites are still derived from the local import queue
- queued and reviewing counts are still computed in the client
- qualified accounts are still derived from saved leads

### V2-full

Introduce a server-side queue and a unified workflow state model.

Recommended states:

- `research_status`
  - `queued`
  - `scanning`
  - `reviewing`
  - `qualified`
  - `archived`

- `handoff_status`
  - `pending`
  - `exported`
  - `outreach_queued`
  - `contacted`
  - `won`

## Data Model Targets

### `queue_items`

Minimum fields:

- `id`
- `workspace_id`
- `domain`
- `website_url`
- `source`
- `note`
- `research_status`
- `lead_id`
- `created_at`
- `updated_at`

### `export_runs`

Minimum fields:

- `id`
- `workspace_id`
- `preset`
- `crm_mode`
- `item_count`
- `created_by`
- `created_at`

## API Targets

### Queue

- `GET /api/queue`
- `POST /api/queue/import`
- `PATCH /api/queue/:id`
- `POST /api/queue/:id/scan`

### Exports

- `GET /api/exports/history`
- `POST /api/exports`

## Multilingual Architecture

### Principles

- keep route ids stable in English
- localize labels, titles, and helper copy
- do not localize URL slugs
- separate short labels from long helper text
- allow text expansion across all supported locales

### Copy Layers

Each task-domain copy block should support:

- `label`
  short nav and CTA text
- `title`
  page title or section title
- `helper`
  explanatory copy

### Required Terminology Consistency

These terms should each have one canonical translation per locale:

- workspace
- queue
- scan
- review
- qualified
- export
- owner
- credits

### Current Locales

- `en`
- `zh`
- `ja`
- `ko`
- `de`
- `nl`
- `fr`

## V2-lite Delivery Scope

Included:

- user-oriented navigation
- new route semantics with legacy aliases
- queue page consolidation
- dedicated exports page
- combined settings page
- updated multilingual route labels and page copy

Not included yet:

- D1-backed queue persistence
- export run history persistence
- unified workflow state tables
- analytics model rewrite

## Acceptance Criteria

- a new user can understand the work sequence from navigation alone
- `Queue` is the obvious place to add sites and process work
- `Qualified` only contains accounts that passed review
- `Exports` is the obvious handoff page
- `Settings` no longer interrupts primary work
- all supported locales preserve the new navigation semantics
