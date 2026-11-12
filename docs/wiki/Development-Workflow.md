# Development Workflow

This document describes the engineering practices, validation standards, and git branching strategies for contributors to the **ZIVAH International Website**.

---

## 🛠️ Prerequisites

- **Node.js**: 18.18.0 or higher (Node 22 LTS recommended)
- **Package Manager**: `pnpm` (Corepack enabled)
- **Database**: PostgreSQL 13+ instance running locally or via Docker
- **Git**: Git 2.30+

---

## 💻 Local Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env.local

# 3. Setup database
pnpm db:generate
pnpm db:push
pnpm db:seed

# 4. Launch development server
pnpm dev
```

---

## 🧪 Quality Gates & Validation Standards

Before pushing commits or opening pull requests, always execute the following verification steps:

```bash
# 1. Code Formatting
pnpm format:check

# 2. TypeScript Typecheck
pnpm type-check

# 3. ESLint Verification
pnpm lint

# 4. Production Build Verification
pnpm build

# 5. Git Cleanliness
git diff --check
```

### Auto-Formatting

To automatically format the repository with Prettier:

```bash
pnpm format
```

---

## 🛡️ Security & Static Analysis

### 1. Snyk Security Scanning (CI Pipeline)

The repository integrates automated security scanning via [`.github/workflows/snyk.yml`](file:///.github/workflows/snyk.yml):

- **Snyk Open Source**: Scans dependencies for high/critical vulnerabilities.
- **Snyk Code**: SAST scanning of application source code.
- **Reports**: Generates HTML and JSON reports uploaded to GitHub Actions artifacts.
- **Required Secret**: `SNYK_TOKEN` (configured in GitHub Repository Secrets).

### 2. SonarQube Local Scanning & API Exporter

Run SonarQube static code quality analysis and export reports against your SonarQube server (e.g. `http://localhost:9000`).

#### Configuration via `.env.local`

To avoid exposing your token in shell history, set credentials in `.env.local`:

```env
SONAR_TOKEN="squ_your_sonarqube_token_here"
SONAR_HOST_URL="http://localhost:9000"
SONAR_PROJECT_KEY="zivah-international-website"
```

#### Execution Commands

```bash
# Full local scan + interactive/automated export to .sonarqube-results
pnpm sonar:local
./scripts/sonarqube-scan.sh --export

# Export-only mode (download metrics & issues via API without re-scanning)
pnpm sonar:export
./scripts/sonarqube-scan.sh --export-only
```

For full details, architecture, and exported artifact structures, see [SonarQube Quality Assurance](SonarQube-Quality-Assurance).

---

## 🌿 Branching & Commit Conventions

### Branch Strategy

- **`main`**: Production releases. Deploys to the production domain.
- **`develop`**: Active integration branch for new features and fixes.
- **`feature/<name>`**: New user features.
- **`fix/<name>`**: Bug fixes.
- **`chore/<name>`**: Tooling, dependencies, and docs.

### Commit Conventions (Conventional Commits)

Commit messages must adhere to the format:

```
<type>(<scope>): <description>
```

- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`
- **Common Scopes**: `auth`, `catalog`, `quote`, `admin`, `db`, `ui`, `i18n`, `deps`
- **Example**: `feat(quote): add support for master carton measurement units`

---

## 🤖 Spec-Kit & AI-Assisted Development

This repository integrates the **Spec-Kit** methodology for spec-driven development. Prompts and skills are configured under `.github/skills/`, `.kiro/prompts/`, `.agents/`, and `.specify/`.

### Required Spec-Driven Workflow

Spec Kit is mandatory for changes that affect application behavior, user-facing functionality, APIs or data contracts, security, database schemas, architecture, infrastructure, or multiple code areas. This includes features, behavioral bug fixes, and refactors. Direct implementation requests do not waive this requirement.

Store each feature's source-of-truth artifacts under `specs/<id>-<short-name>/` and follow this sequence:

1. **Specify (`speckit.specify`)**: Draft or update the functional specification.
2. **Clarify (`speckit.clarify`)**: Resolve material ambiguity and edge cases.
3. **Plan (`speckit.plan`)**: Design an implementation consistent with the project architecture and constitution.
4. **Tasks (`speckit.tasks`)**: Create dependency-ordered, actionable implementation tasks.
5. **Review gates**: Obtain explicit user approval of the spec, plan, and tasks before implementation; do not infer approval from the original request.
6. **Implement (`speckit.implement`)**: Execute only the approved tasks. Update the artifacts and obtain approval if scope changes.
7. **Analyze (`speckit.analyze`)**: Check the result against the spec, plan, tasks, constitution, and applicable quality gates before handoff.

Use the full SDD workflow and do not bypass its review gates. Bug-triage tools may supplement this process but do not replace it. Pure documentation corrections, typo fixes, formatting-only changes, and other mechanical edits with no behavioral impact are exempt. For an urgent security or production fix that cannot wait for the review gates, make the smallest safe change, report the exception, and backfill the SDD artifacts in the same work item.
