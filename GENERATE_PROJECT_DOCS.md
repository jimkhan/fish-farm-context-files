# GENERATE_PROJECT_DOCS.md
# Universal AIDLC Documentation Generator — Multi-Repo Edition
# Version: 2.2
# Purpose: Live this file inside the "<name>-context-files" repo. Run it with an AI
#          coding tool (Cursor, Claude Code, Windsurf, etc.) to generate a complete,
#          traceable, AIDLC-ready spec + contract suite that drives a multi-surface
#          product (backend + web + mobile) from one source of truth.
#
# What changed from v2.1:
#   + Multi-repo layout: all specs live in <name>-context-files (the hub)
#   + contracts/ folder: openapi.yaml + schemas + design tokens, shared by all surfaces
#   + "surface" field on every feature, module, and task (backend | web | mobile | shared)
#   + Phase 7 writes a thin .cursorrules + README pointer into EACH code repo
#   + Traceability now proves coverage per surface, not just per requirement

---

## Core principle (read this first)

The **specification is the source of truth; code is a build artifact.**
The `<name>-context-files` repo holds every spec and contract. The code repos
(`<name>-backend`, `<name>-web`, `<name>-mobile-app`) hold only generated code plus
two tool-required files each. A human reviews and approves every layer; the AI authors
every layer — docs and code alike. When something is wrong, you fix the *spec* and
regenerate. You never hand-patch the output.

For a multi-surface product the second principle is **contract-first**: the backend
implements `contracts/openapi.yaml`, and the web + mobile clients are generated *from*
that same contract — so the three surfaces cannot drift out of sync.

---

## The repo layout (non-negotiable folder rule)

```
<name>/                              ← parent workspace — OPEN THIS so the agent sees all repos
├── <name>-context-files/            ← THE HUB: all specs, contracts, and this generator
│   ├── GENERATE_PROJECT_DOCS.md     ← this file
│   ├── INDEX.md
│   ├── GLOSSARY.md
│   ├── PROJECT_CONCEPT_NOTE.md
│   ├── PRODUCT_SPECIFICATION.md
│   ├── TECHNICAL_SPECIFICATION.md
│   ├── DECISIONS.md
│   ├── FEATURE_LIST.md
│   ├── MODULE_LIST.md
│   ├── BACKLOG.md
│   ├── TRACEABILITY_MATRIX.md
│   ├── MODULE_PROGRESS_TRACKER.md
│   ├── modules/
│   │   └── NN-[module-name].md
│   └── contracts/                   ← shared, machine-readable, consumed by every surface
│       ├── openapi.yaml
│       ├── schemas/
│       └── design-tokens.json
├── <name>-backend/   { .cursorrules · README.md · src/ }   ← code only
├── <name>-web/       { .cursorrules · README.md · src/ }   ← code only
└── <name>-mobile-app/{ .cursorrules · README.md · src/ }   ← code only
```

Rules the AI must obey:
- **Write every spec/contract inside `<name>-context-files/`.** Nothing else goes there's docs.
- **Never write a doc into a code repo**, except the two tool-required files each repo needs:
  its own `.cursorrules` (the AI tool only reads it from that repo's root) and a thin `README.md`
  pointer. Both are generated in Phase 7. Nothing else doc-like enters a code repo.
- **Never write application code during the documentation phases.** Phases 0–7 produce specs
  and contracts only; code is generated later, task by task, from those specs.
- Replace `<name>` with the real project name everywhere.

### Keeping the hub in the agent's context (the make-or-break setup)

The agent must always have the hub in context while it works. Choose one:
- **Best:** keep all four repos under one `<name>/` parent and open that parent as the workspace.
- **Separate repos:** bind them with a multi-root workspace file listing all four paths, OR add
  `<name>-context-files` as a git submodule inside each code repo (read-only).
Never generate code in a repo where the specs are not in the agent's context. That single rule
is what makes AIDLC work across repos.

---

## How to use this file

1. Place this file in `<name>-context-files/` and open the `<name>/` parent as your workspace.
2. Provide at least one prerequisite file (below).
3. Run one phase at a time. Example (Cursor):
   `Read GENERATE_PROJECT_DOCS.md and execute Phase 1`
4. **Review the phase output carefully before running the next phase.** Describe any change
   precisely; the AI revises and re-propagates.
5. Only then run the next phase. Never run multiple phases in one session.

> Paths in the phase commands are relative to `<name>-context-files/` (where generation runs).
> The code repos reach the hub via the workspace/submodule setup above and the `../` path in
> their generated `.cursorrules`.

---

## Prerequisite files (provide at least one)

`PROJECT_BRIEF.md` (name, platform(s), tech stack per surface, problem, users, 5–10 features,
constraints), or `Project Proposal.md` / `SOW` / `PRD` / `WBS` / `Brief.md`. Place it in
`<name>-context-files/`. If none exists, run **Phase 0**.

---

## The ID scheme (the traceability spine)

Stable, immutable IDs; downstream items reference upstream parents by ID.

| Prefix | Artifact | Lives in |
|--------|----------|----------|
| `BR-`   | Business requirement | PROJECT_CONCEPT_NOTE.md |
| `FR-`   | Functional requirement | PRODUCT_SPECIFICATION.md |
| `NFR-`  | Non-functional requirement | PRODUCT_SPECIFICATION.md |
| `ADR-`  | Architecture decision | DECISIONS.md |
| `CON-`  | Contract element (endpoint / schema) | contracts/ (referenced by ID) |
| `FT-`   | Feature | FEATURE_LIST.md |
| `MOD-`  | Module | MODULE_LIST.md |
| `AC-`   | Acceptance criterion | modules/ · BACKLOG.md |
| `TASK-` | Backlog card (Jira) | BACKLOG.md |
| `RISK-` | Risk | PROJECT_CONCEPT_NOTE.md |

**The `surface` attribute.** Every `FT-`, `MOD-`, and `TASK-` carries a surface tag:
`backend` | `web` | `mobile` | `shared`. A single requirement can be delivered across
several surfaces; the traceability matrix proves each targeted surface actually got it.

IDs are immutable. Never renumber. Add new IDs; mark dead ones `[deprecated]`.

---

## AI behavior rules (enforce on every phase)

- **Obey the folder rule.** Specs/contracts only in `<name>-context-files/`; code repos get
  only their `.cursorrules` + `README.md` (Phase 7); never write code during Phases 0–7.
- **Read prerequisite + prior-phase files first.** Update `INDEX.md` at the end of every phase.
- **Assign and reference IDs**, and tag every FT/MOD/TASK with its `surface`.
- **Acceptance criteria are Given/When/Then** — testable, one behavior each.
- **No placeholders.** Complete content only; no "TBD"/skeletons.
- **Make product-quality assumptions** where details are missing; record each, and capture any
  build-shaping choice as an `ADR-`. Do not silently guess.
- **Escalate, do not assume, on guardrail items** (Phase 7). Add unresolved ones to Open Questions.
- **Be consistent.** Defer to `GLOSSARY.md` for terms; keep names/counts/stack aligned across docs.
- **Match filenames and paths exactly.** Stop at the phase boundary with a `PHASE COMPLETE` marker.

### Review-and-propagate (when a reviewed change comes back)
1. Apply the change. 2. Re-propagate downstream by ID (a change to `FR-021` may touch the feature,
module, ACs, cards, the contract, the matrix, and the index). 3. List every artifact you touched
so the human knows what to re-review. A doc edit is never a local fix.

---
---

# PHASE 0 — Bootstrap (only if no prerequisite exists)

**Command:** `Read GENERATE_PROJECT_DOCS.md and execute Phase 0`

Ask the user, one at a time: project name; which surfaces (backend / web / mobile); tech stack
*per surface*; core problem; target users; 5–10 features; constraints. Create
`<name>-context-files/PROJECT_BRIEF.md`. Output: `PHASE 0 COMPLETE — Run Phase 1 next`.
Skip if any scope document already exists.

---
---

# PHASE 1 — Concept, Glossary & Index

**Command:** `Read GENERATE_PROJECT_DOCS.md and all prerequisite files, then execute Phase 1`

Generate three files.

### `GLOSSARY.md`
```
# Glossary — [Project Name]
## Domain terms | Definition | aliases to avoid
## Entities (canonical names) — become shared data models (note which surfaces use each)
## Roles and actors
## Status / state vocabulary
```

### `PROJECT_CONCEPT_NOTE.md` (assign `BR-`, `RISK-`)
```
# Project Concept Note — [Project Name]
## 1. Title and version   ## 2. Executive summary (3–5 sentences)
## 3. Background   ## 4. Problem statement (pain + cost)
## 5. Purpose and objectives (3–5 measurable)
## 6. Business requirements — `BR-NNN`, business language, no solutions (min 8)
## 7. Target users   ## 8. Key features overview (5–8, one paragraph each)
## 9. Surfaces and rationale (why backend/web/mobile; what each is for)
## 10. Expected outcomes   ## 11. Business value
## 12. Scope summary (in/out for v1)   ## 13. Success criteria (KPIs)
## 14. Assumptions (4–8)
## 15. Risks — `RISK-NNN`: description, likelihood, impact, mitigation (3–5)
## 16. Conclusion
```

### `INDEX.md` (entry point; refreshed every phase)
```
# Documentation Index — [Project Name]   ·   Last updated: [date]   ·   Phase: 1
## Surfaces: backend, web, mobile   ## Hub repo: <name>-context-files
## Reading order (the AIDLC cascade): GLOSSARY -> CONCEPT_NOTE -> PRODUCT_SPEC ->
   TECHNICAL_SPEC + DECISIONS + contracts -> FEATURE_LIST + MODULE_LIST -> modules/* ->
   BACKLOG + TRACEABILITY_MATRIX -> MODULE_PROGRESS_TRACKER
## Artifact registry | File | Phase | Status | ID range |
## ID ranges in use (highest number per prefix, so IDs never collide)
```

## Phase 1 completion
```
PHASE 1 COMPLETE — Files: GLOSSARY.md, PROJECT_CONCEPT_NOTE.md, INDEX.md
Review before Phase 2.
Next: Read GENERATE_PROJECT_DOCS.md, GLOSSARY.md, PROJECT_CONCEPT_NOTE.md,
and all prerequisite files, then execute Phase 2
```

---
---

# PHASE 2 — Product Specification

**Command:** `Read GENERATE_PROJECT_DOCS.md, GLOSSARY.md, PROJECT_CONCEPT_NOTE.md, and all prerequisite files, then execute Phase 2`

Generate `PRODUCT_SPECIFICATION.md`. Requirements cite parent `BR-`.
```
# Product Specification — [Project Name]
## 1. Product overview   ## 2. Vision statement   ## 3. Goals (prioritized)
## 4. User personas (2–4)   ## 5. Pain points (per persona)
## 6. User journeys (note which surface each step happens on)
## 7. Functional requirements — `FR-NNN` "The system must..." — parent `BR-NNN`,
   and note target surface(s) per requirement. Min 20.
## 8. Non-functional requirements — `NFR-NNN`, measurable thresholds
   (e.g. "p95 API latency < 200ms @ 500 concurrent"); note which surface each applies to
## 9. Acceptance criteria approach (Given/When/Then; in modules + BACKLOG)
## 10. UX principles   ## 11. Supported platforms/environments per surface
## 12. Feature boundaries (what this is NOT)   ## 13. Assumptions
## 14. Constraints   ## 15. Release scope (v1 vs future)   ## 16. Future roadmap
```
Update `INDEX.md`.

## Phase 2 completion
```
PHASE 2 COMPLETE — File: PRODUCT_SPECIFICATION.md (INDEX updated). Review before Phase 3.
Next: Read GENERATE_PROJECT_DOCS.md, GLOSSARY.md, PROJECT_CONCEPT_NOTE.md,
PRODUCT_SPECIFICATION.md, then execute Phase 3
```

---
---

# PHASE 3 — Technical Spec, Decisions & Contracts

**Command:** `Read GENERATE_PROJECT_DOCS.md, GLOSSARY.md, PROJECT_CONCEPT_NOTE.md, PRODUCT_SPECIFICATION.md, then execute Phase 3`

Generate the technical spec, the decision log, and the shared contract stubs. Cite `FR-`/`NFR-`.

### File 1: `TECHNICAL_SPECIFICATION.md`
```
# Technical Specification — [Project Name]
## 1. Architecture overview (how backend/web/mobile relate; what's shared)
## 2. Tech stack PER SURFACE (backend, web, mobile — frameworks + versions) and shared services/db
## 3. Repo layout and naming conventions (the four-repo structure)
## 4. Major components (per surface, with responsibility + interfaces)
## 5. State management (per client surface)
## 6. Data models and schema (shared entities from GLOSSARY -> contracts/schemas)
## 7. API design (contract-first: REST/GraphQL conventions, auth, key endpoints -> openapi.yaml)
## 8. Navigation / screen hierarchy (web and mobile)
## 9. UI architecture (component strategy, design tokens -> contracts/design-tokens.json, theming)
## 10. Reusable + shared code strategy (what's shared across surfaces vs per-surface)
## 11. Utility / helper strategy   ## 12. Localization / i18n
## 13. Error handling (per surface + shared error contract)
## 14. Performance (per surface targets — satisfies NFRs)
## 15. Accessibility (web + mobile, WCAG level)
## 16. Security (auth flow shared across surfaces, data protection, sensitive data)
## 17. Testing strategy (unit/integration/E2E per surface + contract tests)
## 18. Build, CI/CD, release (per repo + how they coordinate)
## 19. Scalability   ## 20. Coding standards summary
```

### File 2: `DECISIONS.md` (ADRs — the "why" + rejected options)
```
## ADR-NNN — [title]
- Status | Context (which FR/NFR drove it) | Decision | Alternatives rejected (+ why) | Consequences
[Min 5. Include at least: cross-surface architecture, the API contract style, auth model,
shared-vs-duplicated code policy, and the data store.]
```

### File 3: `contracts/openapi.yaml` (+ `contracts/schemas/`, `contracts/design-tokens.json`)
Generate a contract-first stub the backend implements and the clients generate from.
```
# contracts/openapi.yaml — versioned API contract
- info, servers, security scheme (matches the auth ADR)
- paths: one entry per key endpoint from the API design, each tagged with a CON- id in its description
- components/schemas: the shared entities from section 6 (mirror in contracts/schemas/ if used)
# contracts/design-tokens.json — color, type, spacing tokens shared by web + mobile
```
> This is a stub to be expanded as modules are detailed in Phase 5. Endpoints/schemas added
> later must be reflected here AND in the traceability matrix.

Update `INDEX.md`.

## Phase 3 completion
```
PHASE 3 COMPLETE — Files: TECHNICAL_SPECIFICATION.md, DECISIONS.md,
contracts/openapi.yaml, contracts/design-tokens.json (INDEX updated). Review before Phase 4.
Next: Read GENERATE_PROJECT_DOCS.md, PRODUCT_SPECIFICATION.md,
TECHNICAL_SPECIFICATION.md, DECISIONS.md, contracts/openapi.yaml, then execute Phase 4
```

---
---

# PHASE 4 — Feature List & Module Definition

**Command:** `Read GENERATE_PROJECT_DOCS.md, PRODUCT_SPECIFICATION.md, TECHNICAL_SPECIFICATION.md, DECISIONS.md, contracts/openapi.yaml, then execute Phase 4`

### File 1: `FEATURE_LIST.md` — each `FT-` cites its `FR-`s and tags surface(s)
```
### [Group]
| ID | Feature | Description | Delivers | Surface | Priority | Notes |
| FT-NNN | [Name] | [1–2 lines] | FR-NNN | backend, web, mobile | P1 | v1 |
## Priority definitions   ## Feature count summary (total, and per surface)
```
Min 30 features. Every `FR-` delivered by >= 1 `FT-`.

### File 2: `MODULE_LIST.md` — each `MOD-` tags its primary surface + owns `FT-`s
```
### MOD-NN — [Module Name]   (Surface: backend | web | mobile | shared)
- Summary | Scope | Owns features [FT-...] | Sub-modules | Dependencies [MOD-...]
- Contract refs: [CON- ids this module implements or consumes, if any]
- Detail file: modules/NN-[module-name].md
## Module dependency map (must be acyclic; may cross surfaces)
```
Rules: 8–12 modules; every `FT-` maps to exactly one module; zero-padded numbers; specific names.
Shared/cross-surface concerns (auth, the contract, design tokens) may be their own `shared` module.

### File 3: `modules/MODULES_OVERVIEW.md`
```
## Module index | # | Module | Surface | Purpose | Owns features | Detail file |
## Cross-cutting concerns (auth, contract, tokens, error handling, logging)
## Implementation order (respects the dependency DAG; note cross-surface dependencies)
```
Update `INDEX.md`.

## Phase 4 completion
```
PHASE 4 COMPLETE — Files: FEATURE_LIST.md, MODULE_LIST.md, modules/MODULES_OVERVIEW.md
(INDEX updated). Note module numbers/names for Phase 5.
Next (once per module): Read GENERATE_PROJECT_DOCS.md, GLOSSARY.md, PRODUCT_SPECIFICATION.md,
TECHNICAL_SPECIFICATION.md, DECISIONS.md, contracts/openapi.yaml, MODULE_LIST.md,
modules/MODULES_OVERVIEW.md, then execute Phase 5 for module MOD-NN — [Module Name]
```

---
---

# PHASE 5 — Module Detail Files (one per module)

**Command (one per module):** `Read GENERATE_PROJECT_DOCS.md, GLOSSARY.md, PRODUCT_SPECIFICATION.md, TECHNICAL_SPECIFICATION.md, DECISIONS.md, contracts/openapi.yaml, MODULE_LIST.md, modules/MODULES_OVERVIEW.md, then execute Phase 5 for module MOD-NN — [Module Name]`

Generate one file: `modules/NN-[module-name].md`
```markdown
# MOD-NN — [Module Name]
**Project:** [Name] | **Surface:** backend|web|mobile|shared | **Version:** 1.0 | **Status:** Not Started
**Owns features:** [FT-...]   **Contract refs:** [CON-...]   **Dependencies:** [MOD-...]

## 1. Overview (purpose / scope / position in architecture / dependencies)
## 2. Functional details
   2.1 Core functions  2.2 Sub-modules (purpose, behavior, rules, states)
   2.3 User interactions  2.4 Business rules & validation
   2.5 Edge cases (min 5)  2.6 Error states (trigger, message, recovery)
## 3. Non-functional (satisfies which NFR-; per this surface)
## 4. Technical details
   4.1 Components  4.2 Files/folders (in which repo)  4.3 State and data
   4.4 Key logic  4.5 Reusable/shared patterns  4.6 Integration points
   4.7 Contract impact (any new endpoints/schemas -> add to contracts/openapi.yaml)
   4.8 Testing notes
## 5. Acceptance criteria
   - AC-NNN — Given..., When..., Then... — parent FR-NNN
## 6. Implementation & done
   6.1 Definition of done (all ACs tested; contract updated if touched; a11y/security; matrix+tracker updated; reviewed/merged)
   6.2 Implementation notes  6.3 Risks/caveats  6.4 Open questions (esp. guardrail items)
```
Update `INDEX.md`. If this module added/changed endpoints, update `contracts/openapi.yaml` too.

## Phase 5 completion
```
PHASE 5 COMPLETE — MOD-NN: [Name]. File: modules/NN-[module-name].md (INDEX + contracts updated).
Run next module, or when all done:
Read GENERATE_PROJECT_DOCS.md and all files in this repo, then execute Phase 6
```

---
---

# PHASE 6 — Backlog & Traceability

**Command:** `Read GENERATE_PROJECT_DOCS.md and all files in this repo, then execute Phase 6`

### File 1: `BACKLOG.md` — Jira-ready, AI-actionable, surface-tagged cards
```markdown
## TASK-NNN — [Imperative, specific title]
- **Type:** Feature|Bug|Chore|Spike   **Surface:** backend|web|mobile|shared   **Target repo:** <name>-backend
- **Module:** MOD-NN  **Delivers:** FT-NNN  **Satisfies:** FR-NNN, NFR-NNN  **Contract:** CON-NNN
- **Priority:** P1/P2/P3   **Estimate:** [pts]   **Depends on:** [TASK-...] (DAG)

**Context** — why it exists; parents by ID; relevant TECHNICAL_SPEC/DECISIONS/contract refs
**Acceptance criteria** — AC-NNN Given/When/Then (one per behavior)
**Technical notes** — files/modules in the target repo; contract endpoints to honor; entities by GLOSSARY term
**Non-goals** — what this card must NOT do
**Definition of done** — tests per AC pass; coverage; lint/type/security clean; contract + matrix + tracker updated; review gate passed
```
A cross-surface requirement becomes multiple cards (one per surface), each tagged accordingly.
Every `AC-` appears in >= 1 card; dependencies form a DAG.

### File 2: `TRACEABILITY_MATRIX.md` — coverage proof, now per surface
```
## Forward trace | BR | FR | FT | Surface(s) | MOD | AC | TASK |
## Surface coverage | FR | backend? | web? | mobile? |   (every targeted surface must be YES)
## Coverage checks (all must be YES before execution)
- [ ] Every BR -> >= 1 FR;  every FR -> >= 1 FT and >= 1 AC
- [ ] Every FR delivered on EVERY surface it targets (no surface silently missing)
- [ ] Every NFR has a threshold and >= 1 TASK on each surface it applies to
- [ ] Every FT -> exactly one MOD;  every AC -> >= 1 TASK
- [ ] Every endpoint in openapi.yaml is implemented (backend) and consumed (clients) by a TASK
- [ ] Every TASK traces back to a requirement;  task graph is acyclic
```
Update `INDEX.md`.

## Phase 6 completion
```
PHASE 6 COMPLETE — Files: BACKLOG.md, TRACEABILITY_MATRIX.md (INDEX updated).
Any "NO" in coverage is a gap to fix before Phase 7.
Next: Read GENERATE_PROJECT_DOCS.md and all files in this repo, then execute Phase 7
```

---
---

# PHASE 7 — Execution Setup (tracker + per-repo rules)

**Command:** `Read GENERATE_PROJECT_DOCS.md and all files in this repo, then execute Phase 7`

Generate the tracker in the hub, and a `.cursorrules` + `README.md` in EACH code repo
(the only doc-like files allowed outside the hub).

### File 1: `MODULE_PROGRESS_TRACKER.md` (in the hub)
```markdown
# Module Progress Tracker — [Project Name]   ·   Last updated: [date]
## Status legend (Not Started / In Progress / In Review / Blocked / Completed)
## Module status
### MOD-NN — [Name]  (Surface)  | Overall | Owner | Started | Completed
| Sub-module | Tasks | Surface | Status | Notes |
## Summary dashboard | Module | Surface | Tasks | Completed | Status |  + per-surface totals
## Blocked items   ## Notes and decisions log
```

### Files 2–4: `<name>-backend/.cursorrules`, `<name>-web/.cursorrules`, `<name>-mobile-app/.cursorrules`
Each created at that repo's root. Same body, with the repo's own surface/name filled in:
```
# ============================================================
# AIDLC EXECUTION RULES — [Project Name] — surface: [backend|web|mobile]
# ============================================================
## Source of truth
The specs in ../<name>-context-files/ are the source of truth. This repo holds only code
generated from them. Never hand-edit code to fix a problem — fix the spec, then regenerate.

## Where things live
- Specs/plans/contracts: ../<name>-context-files/  (start at ../<name>-context-files/INDEX.md)
- The API contract: ../<name>-context-files/contracts/openapi.yaml
- This repo: generated [backend|web|mobile] code only

## Per-task workflow (never skip)
1. READ the task card in ../<name>-context-files/BACKLOG.md (cards tagged surface=[this]) + its module file
2. ASSEMBLE context: parent IDs, glossary terms, relevant ADRs, the contract, current code
3. GENERATE code AND tests (one test per AC) — backend implements the contract; clients generate from it
4. VERIFY: tests pass, coverage met, lint/type/security clean, contract tests pass, build succeeds
5. REVIEW: a human checks intent/correctness (not syntax)
6. If wrong -> fix the SPEC or card, regenerate. Do NOT hand-patch.
7. INTEGRATE: merge; update ../<name>-context-files/TRACEABILITY_MATRIX.md + MODULE_PROGRESS_TRACKER.md
8. COMMIT with TASK- and MOD- IDs

## Guardrails — STOP and ask a human, never decide alone:
- Changing a frozen ADR, or changing contracts/openapi.yaml (it affects other surfaces)
- Adding/removing a data entity or shared schema
- Anything touching auth, payments, PII, or compliance
- Contradicting an NFR threshold; adding an unapproved dependency
- Any scope beyond the card's acceptance criteria

## Never: write specs into this repo; implement without reading the card; mark done without
passing ACs; rename an ID/file without updating every cross-reference, the contract, the matrix, INDEX.md
# ============================================================
```

### Files 5–7: `<name>-backend/README.md` (and -web, -mobile-app)
```
# <name>-[surface]
Generated [backend|web|mobile] code for [Project Name].
The source of truth is the spec hub: ../<name>-context-files/ (start at INDEX.md).
Do not edit code by hand — change the spec and regenerate. See .cursorrules.
```
Update `INDEX.md` (mark suite complete).

## Phase 7 completion
```
PHASE 7 COMPLETE — AIDLC suite generated.
Hub: MODULE_PROGRESS_TRACKER.md.  Per repo: .cursorrules + README.md.
Confirm the completeness gate below, then build task by task per each repo's .cursorrules.
```

---
---

## Completeness gate (ready to execute when ALL hold)

Test: *could an AI agent with only the hub in context execute any card and build the right thing?*
- [ ] Every `BR` -> >= 1 `TASK`; every `TASK` -> a requirement
- [ ] Every `FR` delivered on every surface it targets; surface coverage matrix has no missing YES
- [ ] Every `NFR` has a measurable threshold + task(s) on each applicable surface
- [ ] Every acceptance criterion is Given/When/Then and testable
- [ ] `contracts/openapi.yaml` covers every endpoint; each is built + consumed by a task
- [ ] Data models, schemas, integration points fully specified; task graph is a valid DAG
- [ ] GLOSSARY covers every term; DECISIONS covers every significant choice + rejected options
- [ ] All specs live in `<name>-context-files/`; each code repo has only `.cursorrules` + `README.md` + code

Any unchecked box is planning work remaining — not something to discover mid-build.

---

## Quick reference: all commands (run from <name>-context-files, one at a time)

```
# Phase 0 (only if no prerequisites)
Read GENERATE_PROJECT_DOCS.md and execute Phase 0
# Phase 1
Read GENERATE_PROJECT_DOCS.md and all prerequisite files, then execute Phase 1
# Phase 2
Read GENERATE_PROJECT_DOCS.md, GLOSSARY.md, PROJECT_CONCEPT_NOTE.md, and all prerequisite files, then execute Phase 2
# Phase 3
Read GENERATE_PROJECT_DOCS.md, GLOSSARY.md, PROJECT_CONCEPT_NOTE.md, PRODUCT_SPECIFICATION.md, then execute Phase 3
# Phase 4
Read GENERATE_PROJECT_DOCS.md, PRODUCT_SPECIFICATION.md, TECHNICAL_SPECIFICATION.md, DECISIONS.md, contracts/openapi.yaml, then execute Phase 4
# Phase 5 (repeat per module)
Read GENERATE_PROJECT_DOCS.md, GLOSSARY.md, PRODUCT_SPECIFICATION.md, TECHNICAL_SPECIFICATION.md, DECISIONS.md, contracts/openapi.yaml, MODULE_LIST.md, modules/MODULES_OVERVIEW.md, then execute Phase 5 for module MOD-01 — [Module Name]
# Phase 6
Read GENERATE_PROJECT_DOCS.md and all files in this repo, then execute Phase 6
# Phase 7
Read GENERATE_PROJECT_DOCS.md and all files in this repo, then execute Phase 7
```

---

## Troubleshooting

**AI wrote a doc into a code repo** — `You wrote [file] into <name>-[surface]. Only .cursorrules and
README.md may live there. Move the content into <name>-context-files/, fix references + INDEX.md.`

**Agent can't see the specs while coding** — Your code repo isn't sharing the agent's context with
the hub. Open the <name>/ parent as one workspace, or submodule <name>-context-files into the repo.

**A surface was silently skipped** — `TRACEABILITY_MATRIX surface coverage shows FR-NNN missing on
[surface]. Add the [surface] task(s) and ACs so every targeted surface is covered.`

**Contract drift between surfaces** — `An endpoint changed in one repo but not contracts/openapi.yaml.
Update the contract first, then regenerate the backend impl and the client(s) from it.`

**Thin/placeholder content** — `Rewrite [section] with full content. No TBD.`
**Merged phases** — `Stop. Redo only Phase [N] and stop at its boundary.`
**Context window exceeded** — Fresh session; reference files by path so the tool reads from disk.

---

*GENERATE_PROJECT_DOCS.md v2.2 — Multi-Repo AIDLC Generator.*
*One hub (<name>-context-files) of specs + contracts drives backend, web, and mobile.*
*Specs are the source of truth; code is built from them.*
