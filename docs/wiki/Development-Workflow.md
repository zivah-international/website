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

### The Spec-Driven Workflow:

1. **Specify (`speckit-specify`)**: Draft the functional specification for the new requirement.
2. **Clarify (`speckit-clarify`)**: Identify edge cases, questions, and ambiguous requirements.
3. **Plan (`speckit-plan`)**: Generate technical implementation plans conforming to the architecture.
4. **Tasks (`speckit-tasks`)**: Create an ordered checklist of discrete development tasks.
5. **Implement (`speckit-implement`)**: Execute the implementation against the task list.
6. **Analyze (`speckit-analyze`)**: Verify consistency and pass all quality gates.
