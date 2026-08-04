#!/usr/bin/env bash
#
# populate-docs — scaffold a documentation folder in the current project.
#
# Creates (by default) ./docs/ with:
#   README.md, USER_GUIDE.md, DEVELOPER_GUIDE.md, ARCHITECTURE.md,
#   CHANGELOG_TEMPLATE.md, DOCS_PROMPT.md
#
# Usage:
#   bash populate-docs.sh [folder] [--force] [--yes]
#   curl -fsSL <url> | bash                                # non-interactive
#   curl -fsSL <url> -o populate-docs.sh && bash populate-docs.sh   # interactive
#
set -euo pipefail

VERSION="1.0.0"
DEFAULT_DIR="docs"
FORCE=0
YES=0
TARGET_DIR="$DEFAULT_DIR"

usage() {
  cat <<'USAGE'
populate-docs v1.0.0 — scaffold a documentation folder in the current project.

Usage:
  bash populate-docs.sh [folder] [options]

Options:
  --force    Overwrite files that already exist and skip the conflict prompt
             (default: keep them)
  --yes, -y  Non-interactive; if the folder exists, auto-pick the next free name
  -h, --help Show this help

Folder:
  Defaults to "docs". If the folder exists you will be asked how to proceed
  (unless --force or --yes is given).

Created files:
  <folder>/README.md, USER_GUIDE.md, DEVELOPER_GUIDE.md,
  ARCHITECTURE.md, CHANGELOG_TEMPLATE.md, DOCS_PROMPT.md
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=1 ;;
    --yes|-y) YES=1 ;;
    -h|--help) usage; exit 0 ;;
    --*) echo "Unknown option: $1" >&2; usage; exit 1 ;;
    *) TARGET_DIR="$1" ;;
  esac
  shift
done

BASE_DIR="$TARGET_DIR"

sanitize_name() {
  local n="$1"
  if [[ "$n" =~ ^[A-Za-z0-9._-]+$ ]]; then
    printf '%s' "$n"
  else
    printf 'docs'
  fi
}

next_available() {
  local base="$1" n=2
  while [[ -e "${base}-${n}" ]]; do n=$((n + 1)); done
  printf '%s' "${base}-${n}"
}

TARGET_DIR="$(sanitize_name "$TARGET_DIR")"
BASE_DIR="$TARGET_DIR"

if [[ -e "$TARGET_DIR" ]]; then
  if [[ "$FORCE" == 1 ]]; then
    :
  elif [[ "$YES" == 1 ]] || [[ ! -t 0 ]]; then
    TARGET_DIR="$(next_available "$BASE_DIR")"
    echo "note: '$BASE_DIR/' already exists; using '$TARGET_DIR/' instead"
  else
    echo ""
    echo "'$TARGET_DIR/' already exists. What would you like to do?"
    echo "  1) Add missing files to $TARGET_DIR/ (keep existing files)"
    echo "  2) Create a different folder"
    echo "  3) Abort"
    printf 'Choose 1, 2, or 3: '
    read -r choice || choice=""
    case "$choice" in
      1) ;;
      2)
        suggested="$(next_available "$BASE_DIR")"
        printf 'Folder name [%s]: ' "$suggested"
        read -r custom || custom=""
        if [[ -n "$custom" ]]; then
          TARGET_DIR="$(sanitize_name "$custom")"
        else
          TARGET_DIR="$suggested"
        fi
        ;;
      3)
        echo "Aborted. Nothing was created."
        exit 1
        ;;
      *)
        echo "Invalid choice. Aborted. Nothing was created."
        exit 1
        ;;
    esac
  fi
fi

mkdir -p "$TARGET_DIR"
echo ""
echo "Populating '$TARGET_DIR/' ..."

write_file() {
  local path="$1"
  local producer="$2"
  if [[ -e "$path" && "$FORCE" != 1 ]]; then
    echo "  skip  $path (already exists)"
    return
  fi
  "$producer" > "$path"
  echo "  wrote $path"
}

# ---------------------------------------------------------------------------
# Templates
# ---------------------------------------------------------------------------

template_readme() {
  cat <<'TEMPLATE_EOF'
# <Project Name>

> ⚠️ TODO: Replace this paragraph with a one-paragraph description of what the
> project is and who it is for. Keep it plain — a newcomer should understand it.

## Key features

- ⚠️ TODO: Feature one
- ⚠️ TODO: Feature two
- ⚠️ TODO: Feature three

## Tech stack

⚠️ TODO: Fill in the real stack from `package.json` / `requirements.txt` / `go.mod`, etc.

| Layer | Technology |
| --- | --- |
| ⚠️ TODO | ⚠️ TODO |
| ⚠️ TODO | ⚠️ TODO |

## Architecture at a glance

```mermaid
flowchart LR
  A[Client] --> B[Service]
  B --> C[Database]
```

⚠️ TODO: Replace with a diagram that reflects the real system.

## Quick start

```bash
# ⚠️ TODO: Replace with the project's real commands
git clone <your-repo-url>
cd <your-project>
npm install
npm run dev
```

## Further reading

- [User Guide](./USER_GUIDE.md) — how to use the project, no code required.
- [Developer Guide](./DEVELOPER_GUIDE.md) — setup, architecture, and contribution details.
- [Architecture](./ARCHITECTURE.md) — diagram-first overview of how the system fits together.
- [Changelog](./CHANGELOG_TEMPLATE.md) — keep a record of releases (blank template).
TEMPLATE_EOF
}

template_user_guide() {
  cat <<'TEMPLATE_EOF'
# User Guide

> ⚠️ TODO: This guide is for a NON-TECHNICAL reader — zero code, zero jargon.
> Fill in every section with real, verified detail from the project. Every screen
> mention must state exactly what to click to reach it.

## How to access the project

⚠️ TODO: Explain how someone opens the project (login URL, install command, or
"no login required — it's public").

## Getting to know the screen

⚠️ TODO: Teach the app's UI patterns once — the navigation structure, list vs.
board views, how forms behave, and the common icons/buttons users will see.

## Glossary

⚠️ TODO: Plain-language definitions of the domain terms the app uses.

## Quick start — most common tasks

⚠️ TODO: A table of the 4-5 most common tasks and where to click.

| Task | What to do |
| --- | --- |
| ⚠️ TODO | ⚠️ TODO |
| ⚠️ TODO | ⚠️ TODO |

## Screens and what you can do

### ⚠️ TODO: Screen name (what to click to reach it)

⚠️ TODO: What it's for, what you can do, with numbered steps for anything
multi-step.

### ⚠️ TODO: Next screen (what to click to reach it)

⚠️ TODO: Repeat for every screen. If a screen isn't in the main navigation, say
precisely how it IS reached (search, a link on another page, or a raw URL).

## Example workflows

⚠️ TODO: 2-3 end-to-end walks that tie multiple screens together.

## FAQ

### ⚠️ TODO: "I can't find X"

⚠️ TODO: Answer in plain language.

## Further reading

- [README](./README.md) — project overview.
- [Developer Guide](./DEVELOPER_GUIDE.md) — the technical version of this guide.
TEMPLATE_EOF
}

template_developer_guide() {
  cat <<'TEMPLATE_EOF'
# Developer Guide

> ⚠️ TODO: For engineers. Fill in with verified, code-accurate detail.

## Local setup

- Prerequisites: ⚠️ TODO (e.g. Node >= 18.17, Python 3.11, Docker)
- Environment variables: ⚠️ TODO (name, required/optional, purpose)
- Run commands: ⚠️ TODO

## Folder structure

⚠️ TODO: Explain what each top-level directory is for.

```
⚠️ TODO
```

## Architecture decisions and request/data flow

⚠️ TODO: Key decisions, and what happens when a request or job moves through the system.

## Data / content model

⚠️ TODO: Field-by-field or table-by-table, with small mermaid ER diagrams per logical group.

## API / routing reference

⚠️ TODO: Every endpoint or route: method, path, auth, request/response, plus a
couple of runnable curl or command examples.

## Coding conventions

⚠️ TODO: Naming, formatting, and patterns actually observed in the code.

## Checklist: adding a new route / page / command

1. ⚠️ TODO
2. ⚠️ TODO
3. ⚠️ TODO

## Tests

⚠️ TODO: How to run them, what they cover, and what coverage is missing.

## Deployment

⚠️ TODO: The deployment process end to end.

## Known limitations / tech debt

- ⚠️ TODO: Quirks, missing tests, placeholder assets, intentional shortcuts.

## Further reading

- [Architecture](./ARCHITECTURE.md) — diagram-first overview.
- [User Guide](./USER_GUIDE.md) — the non-technical version.
- [README](./README.md) — project overview.
TEMPLATE_EOF
}

template_architecture() {
  cat <<'TEMPLATE_EOF'
# Architecture

> ⚠️ TODO: Diagram-first "what connects to what and why". Keep each diagram small
> enough to read — split into several rather than cramming one.

## System landscape

```mermaid
flowchart LR
  A[TODO component] --> B[TODO component]
  B --> C[TODO component]
```

⚠️ TODO

## Request / auth flow

```mermaid
sequenceDiagram
  participant U as User
  participant A as App
  participant B as Backend
  U->>A: TODO
  A->>B: TODO
```

⚠️ TODO: Include an auth sequence diagram ONLY if auth exists — otherwise omit it.

## Data layer

```mermaid
erDiagram
  TODO {
    string id
  }
```

⚠️ TODO: Grouped, not exhaustive.

## External integrations

⚠️ TODO

| Integration | Required / optional | Notes |
| --- | --- | --- |
| ⚠️ TODO | ⚠️ TODO | ⚠️ TODO |

## Tech stack

⚠️ TODO

## Glossary

⚠️ TODO
TEMPLATE_EOF
}

template_changelog() {
  cat <<'TEMPLATE_EOF'
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- ⚠️ TODO: New features

### Changed
- ⚠️ TODO: Changes in existing functionality

### Deprecated
- ⚠️ TODO: Soon-to-be removed features

### Removed
- ⚠️ TODO: Removed features

### Fixed
- ⚠️ TODO: Bug fixes

### Security
- ⚠️ TODO: Vulnerability fixes

## [0.1.0] - YYYY-MM-DD

### Added
- ⚠️ TODO: Initial release notes

<!--
[Unreleased]: https://github.com/<owner>/<repo>/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/<owner>/<repo>/releases/tag/v0.1.0
-->
TEMPLATE_EOF
}

template_prompt() {
  cat <<'TEMPLATE_EOF'
# Self-Contained Documentation Generation Prompt (use on ANY repo)

> This file is the scaffolding prompt itself — NOT one of the five deliverables.
> Copy its contents into your AI agent of choice to generate the real documentation set.

## How to use this prompt
- Paste this whole prompt into any codebase and run it. It is fully self-contained:
  everything the agent needs is explained below — no prior context required.
- The deliverable is a new `{{DOCS_DIR}}` folder at the repo root, created if it doesn't exist.
- The final section, "PROJECT CONTEXT", is OPTIONAL. It only applies when the repo matches that
  description. For any other project, delete that section before pasting.

## What this task IS (read this first — this prompt creates a documentation set)
You will produce a set of five markdown files inside a `{{DOCS_DIR}}` folder at the root of THIS
project. `{{DOCS_DIR}}` is a conventional place for human-readable project documentation (as
opposed to the code folders). It may or may not already exist:

- If `{{DOCS_DIR}}` does NOT exist, create it and generate all five files fresh.
- If `{{DOCS_DIR}}` DOES exist, each file is handled separately (see "Existing vs. fresh" below) —
  never assume a file is absent just because the folder exists, and never delete other people's files.

The five target files are:
1. `{{DOCS_DIR}}/README.md` — Project Overview (what it is, key features, tech stack, architecture
   diagram, quick start).
2. `{{DOCS_DIR}}/USER_GUIDE.md` — for a non-technical person who uses/reads this project.
3. `{{DOCS_DIR}}/DEVELOPER_GUIDE.md` — for engineers who build on it.
4. `{{DOCS_DIR}}/ARCHITECTURE.md` — diagram-first "what connects to what" reference.
5. `{{DOCS_DIR}}/CHANGELOG_TEMPLATE.md` — a blank Keep a Changelog template.

Each file's full spec is in Step 2. The project may lack some of the things the specs mention
(no login screen, no API, no database). When that happens you DO NOT invent them — you say so
explicitly in the doc and adapt the section. Instructions for this are baked into each step.

## STEP 1 — DISCOVERY (do this first, show me before writing anything)

Output a short **Project Map** and stop. Wait for my confirmation before Step 2.

Scan the full project and report on every item below. When an item does not apply to this project,
say "N/A — <one-line reason>" rather than silently dropping it. Base every claim on actual code and
files — never on memory, convention, or assumption.

- **Tech stack** — languages, frameworks, and EXACT versions from `package.json` /
  `requirements.txt` / `go.mod` / `Cargo.toml` / etc.
- **Entry points and overall folder structure** — what each top-level directory is for (e.g. a UI
  folder, a library folder, a content folder, a config folder). This is the map readers will use to
  navigate your docs.
- **Backends/services** — if there is a server or services, how they talk to each other (direct
  calls? a proxy/BFF? separate auth service?). If there is NO backend (pure static site, CLI tool,
  or library), say so plainly.
- **API routes/endpoints** — if a backend exists: every endpoint with method, path, auth
  requirement, and request/response shape. If the project instead uses file-based or framework
  routing (e.g. Next.js/App Router, SvelteKit, a static site generator), document THAT routing
  scheme in equivalent detail. If neither exists, say so.
- **Database models/schema** — if a database exists: tables/models and relationships. If the
  project uses files or content as its "database" (e.g. markdown content, JSON config, YAML data),
  document that content model instead. If neither, say so.
- **The ACTUAL navigation structure (if there is a UI) — READ THE CODE, DO NOT INFER.** Open the
  sidebar/nav/router/route-map source directly and report:
  - the exact clickable label for every screen/route (as rendered, not filename-derived guesses),
  - which screens are NOT in the main nav (reached only via search, a button on another page, or a
    raw URL),
  - any unreachable/dead routes,
  - if there is NO UI (CLI/library/headless), state that and instead map the user-facing "surfaces"
    (commands, exports, entry points) the same way.
- **Environment variables / config** — every env var required to run it (with which are optional),
  and which config files matter (`.env*`, `next.config.*`, `tailwind.config.*`, `tsconfig`,
  linters, etc.).
- **Build, run, test, deploy scripts** — from package.json scripts, Makefile, Dockerfile, CI configs
  (.github/workflows, .gitlab-ci.yml, etc.). Be honest about which exist and which don't (e.g. "no
  test script exists").
- **Existing README/docs** — anything already in the repo (root README, `{{DOCS_DIR}}/`,
  comments-as-docs). Your generated set must extend, correct, or link to them — never silently
  duplicate.
- **Third-party integrations** — auth providers, payment, push, analytics, AI services, error
  tracking, etc. Classify each as: required / optional / wired-but-inactive. If there are none, say
  so (don't invent any).
- **Auth/authorization** — if login exists: the full flow, and where permissions/scope are layered
  (role-based gates vs. row-level data scope — these are often conflated; call them out separately).
  If there is NO auth, say so plainly.
- **Tests** — what tests exist, and the exact command(s) to run them. Report real coverage; if there
  is no test suite or test script, say so explicitly.
- **The `{{DOCS_DIR}}` existence check** — for EACH of the five target files (README.md,
  USER_GUIDE.md, DEVELOPER_GUIDE.md, ARCHITECTURE.md, CHANGELOG_TEMPLATE.md) under `{{DOCS_DIR}}`,
  note whether it exists. For each that exists, skim it and say in one line whether it looks
  current, partially stale, or factually wrong. This determines whether Step 2 is a fresh
  generation or an update pass for that file. If the `{{DOCS_DIR}}` folder itself doesn't exist,
  say so — everything in Step 2 is then fresh.

## STEP 2 — GENERATE OR UPDATE THE DOCS

Once I confirm the Project Map, for each of the five target files, first check whether it already
exists in `{{DOCS_DIR}}`:

- **If it doesn't exist:** create it fresh per the spec below.
- **If it already exists:** read it in full first. This is an update pass, not a replacement — keep
  everything still accurate, correct anything wrong (say explicitly what and why), add what's
  missing, remove what no longer applies, preserve the file's existing structure/tone where
  reasonable. End each updated file with a short "What changed in this update" note so I can see
  the delta without diffing.

### `{{DOCS_DIR}}/README.md`
One-paragraph description, key features, a tech stack table, a mermaid architecture diagram, and
copy-pasteable quick start commands (clone → install → run).

### `{{DOCS_DIR}}/USER_GUIDE.md`
For a non-technical end user — zero code, zero jargon.
- If the project has a UI: start with how to log in/access it, a "getting to know the screen"
  section teaching the app's general UI patterns ONCE (nav structure, list vs. board views, how
  forms behave, common icons), and a plain-language glossary of domain terms.
- If the project has NO UI (CLI, library, or a site whose users are readers, not operators): say so
  up front, reframe the guide for the project's real audience (e.g. "how to read the docs site" or
  "how to install and use the command"), and keep the same zero-jargon register.
- Add a "Quick Start" table pointing at the 4-5 most common tasks.
- Walk every screen/command/route: what it's for, what you can do, and for anything more than a
  single click — actual numbered steps, not just bullets.
- Every screen section must open with a line stating EXACTLY what to click to reach it (exact
  sidebar label, tab name, or button — from the nav code you read in Step 1, not guessed). If a
  screen isn't in the main nav, say precisely how it IS reached (global search, another page's
  link, or "no link exists anywhere — direct URL only").
- End with a few end-to-end example workflows and an FAQ covering first-time realities (permissions
  confusion, login issues, "I can't find X").

### `{{DOCS_DIR}}/DEVELOPER_GUIDE.md`
For engineers. Local setup (prerequisites, full env var reference, run commands), folder structure
explained, architecture decisions and request/data flow, the full data or content model (table by
table or field by field, with small mermaid ER diagrams per logical group — not one giant diagram),
the full API or routing reference (every endpoint or route: method, path, auth, request/response,
plus a couple of runnable curl or command examples), coding conventions actually observed in the
code, a repeatable checklist for adding a new route/page/command (adapted to this project's routing
scheme), how to run and add tests (be honest about current coverage), the deployment process end to
end, and a **Known Limitations / Tech Debt** section (quirks, missing tests, placeholder assets,
intentional shortcuts — anything a new engineer would trip on).

### `{{DOCS_DIR}}/ARCHITECTURE.md`
A short, diagram-first "what connects to what and why" reference, separate from the exhaustive
developer guide. Mermaid diagrams in plain markdown fences (renders natively in GitHub/VS Code), each
small enough to read — split into several rather than cramming one. Cover: system landscape (core
services/parts), external integrations, request/auth flow (include an auth sequence diagram ONLY if
auth exists — otherwise omit it, don't fake one), data layer (grouped, not exhaustive),
deployment/infra, an integration reference table, tech stack table, and a glossary.

### `{{DOCS_DIR}}/CHANGELOG_TEMPLATE.md`
A blank Keep a Changelog (keepachangelog.com) template. If the repo already has a changelog in a
different format, don't touch it — this is a separate, forward-looking template.

## RULES
- Base everything strictly on what's actually in the code. Never invent an endpoint, env var,
  feature, screen, route, or navigation label.
- If something is ambiguous or unconfirmed (production URL, a deploy trigger, an intent behind
  unusual behavior), write `⚠️ NEEDS CONFIRMATION: ...` instead of guessing.
- If you find an existing doc/diagram in the repo that's factually wrong, correct it in your version
  and say so explicitly — don't silently repeat the error.
- Cross-link the docs to each other (Quick Start → full walkthrough, User Guide → Developer Guide
  for the technical version, etc.).
- Write the User Guide and Developer Guide in genuinely different registers — zero technical
  vocabulary in one, precise and technical in the other.
- For any file that already exists, this is an update, not a rewrite — see Step 2.

## Two things worth knowing before you reuse this
1. Discovery on a large codebase is often too big for one pass. If the project has a big API
   surface, schema, or many pages, delegate the endpoint inventory / schema inventory /
   page-walkthrough to subagents in parallel rather than reading everything yourself — otherwise you
   run out of context or give a shallow pass.
2. The navigation-accuracy step is the one people skip and shouldn't. It is what turns a
   plausible-sounding guide into an actually correct one — keep it even if you shorten the rest of
   the prompt.

---

## OPTIONAL PROJECT CONTEXT — only applies if this repo matches the description below
(delete for other projects)

⚠️ TODO: If you are scaffolding docs for a project with known quirks, facts, or conventions,
record them here so the agent verifies rather than re-derives them. Delete or leave blank for
generic projects.
TEMPLATE_EOF
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

write_file "$TARGET_DIR/README.md" template_readme
write_file "$TARGET_DIR/USER_GUIDE.md" template_user_guide
write_file "$TARGET_DIR/DEVELOPER_GUIDE.md" template_developer_guide
write_file "$TARGET_DIR/ARCHITECTURE.md" template_architecture
write_file "$TARGET_DIR/CHANGELOG_TEMPLATE.md" template_changelog

tmp_prompt="$(mktemp)"
template_prompt > "$tmp_prompt"
if [[ -e "$TARGET_DIR/DOCS_PROMPT.md" && "$FORCE" != 1 ]]; then
  echo "  skip  $TARGET_DIR/DOCS_PROMPT.md (already exists)"
else
  sed "s/{{DOCS_DIR}}/$TARGET_DIR/g" "$tmp_prompt" > "$TARGET_DIR/DOCS_PROMPT.md"
  echo "  wrote $TARGET_DIR/DOCS_PROMPT.md (docs folder: '$TARGET_DIR')"
fi
rm -f "$tmp_prompt"

echo ""
echo "Done. Files created in '$TARGET_DIR/':"
ls -1 "$TARGET_DIR" | sed 's/^/  /'
echo ""
echo "Next step: open $TARGET_DIR/DOCS_PROMPT.md with your AI agent to generate"
echo "the real documentation into these files."
