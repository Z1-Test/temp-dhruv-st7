# Planning Orchestration System

A **docs-first planning framework** that transforms product intent into structured, reviewable documentation through coordinated **Agent Skills**, **cloud agents**, and **human approvals**.

## Overview

This repository implements an automated planning workflow where:

- **Product intent** is captured in PRDs and roadmaps
- **Ambiguities** are resolved before execution begins
- **Feature specifications** are generated asynchronously by cloud agents
- **Human review** gates every planning phase
- **Documentation** always precedes implementation

## Architecture

### Planner Agent

The **Planner Agent** is the central orchestrator that:

- Coordinates planning phases end-to-end
- Invokes Agent Skills for content generation
- Creates Pull Requests and Instructional Issues
- Enforces docs-first, human-approved workflows
- **Never owns content or execution state**

> The Planner is a control-plane agent: it coordinates work and enforces invariants.

### Agent Skills

#### Product Intelligence Skills

- **PRD Authoring** — Captures product intent
- **Ambiguity Detection** — Identifies unanswered decisions
- **Feature & Roadmap Decomposition** — Defines feature surface
- **Feature Specification** — Generates detailed feature docs
- **Gherkin Authoring** — Creates acceptance criteria
- **Change Maintenance Specification** — Handles updates
- **Epic Definition** — Groups features for execution
- **Dependency & Scope Analysis** — Maps execution order

#### GitHub Operations Skills

- **github-kernel** — Safety rules & tool selection
- **github-issues** — Issue lifecycle & Copilot assignment
- **github-pr-flow** — Branch & PR lifecycle

## Planning Flow

### Phase 1: Product Definition

- Generate PRD via PRD Authoring Skill
- Output: `docs/product/PRD.md`

### Phase 2: Ambiguity Resolution

- Detect ambiguities via Ambiguity Detection Skill
- Create `docs/planning/CLARIFICATIONS.md` if needed
- Iterate until all questions are answered

### Phase 3: Feature Surface Definition

- Generate roadmap via Feature & Roadmap Decomposition Skill
- Output: `docs/product/roadmap.md`
- Iterate with structured refinements (SPLIT, MERGE, ADD, REMOVE, RENAME)
- Continue when user approves roadmap

### Phase 4: Planning Pull Request

- Create branch: `docs/planning-baseline`
- Push PRD and Roadmap
- Create PR with title: `docs: establish planning baseline (PRD + Roadmap)`
- Request human review

### Phase 5: Instructional Issue

- Create issue for specification generation
- Include explicit branch targeting
- Stop and hand off to user for Copilot assignment

### Phase 6: Human Handoff (Manual)

1. Navigate to Instructional Issue
2. Assign to `@github-copilot` with branch selection
3. Wait for documentation generation
4. Review updated Planning PR
5. Merge to `main`

### Phase 7: Cloud Agent Execution

- Cloud agents work on Planning PR branch
- Generate Epic docs in `docs/epics/`
- Generate Feature specs in `docs/features/<bounded-context>/`
- Generate Execution Flow in `docs/execution/execution-flow.md`
- Commit directly to Planning PR branch

### Phase 8: Post-Merge Automation (Out of Scope)

- Automation creates Epic and Feature issues
- Assigns numbers and renames files
- Syncs docs to issues

## Key Principles

### Docs-First Planning

All product intent must be documented and reviewed before implementation begins.

### Human-Approved Workflows

The Planner enforces human review gates at critical decision points.

### Asynchronous Execution

Cloud agents generate documentation in the background on the same Planning PR branch.

### Stateless Skills

Skills return content only—they never orchestrate or mutate state.

### Bounded Context Mapping

Features are organized by bounded context as defined in the roadmap.

## Directory Structure

```
docs/
├── product/
│   ├── PRD.md              # Product Requirements Document
│   └── roadmap.md          # Feature roadmap with bounded contexts
├── planning/
│   └── CLARIFICATIONS.md   # Ambiguity resolution questions
├── epics/
│   └── *.md                # Epic grouping documents
├── features/
│   └── <bounded-context>/
│       └── *.md            # Feature specification documents
└── execution/
    └── execution-flow.md   # Dependency and parallelism map
```

## Invariants

The Planner enforces these invariants:

- ✅ Docs precede execution
- ✅ Intent is human-reviewed
- ✅ Only one planning PR exists
- ✅ Instructional Issues are explicit
- ✅ Cloud agents are stateless
- ✅ Ordering lives in issues, not filenames
- ✅ Epics group execution only

## Skills Directory

All Agent Skills are located in `.github/skills/`:

- `research-prd-authoring/`
- `doc-ambiguity-detection/`
- `doc-feature-roadmap-decomposition/`
- `doc-feature-specification/`
- `doc-gherkin-authoring/`
- `doc-change-maintenance-specification/`
- `github-kernel/`
- `github-issues/`
- `github-pr-flow/`
- `doc-markdown/`

## Getting Started

1. Trigger the Planner Agent with product intent
2. Review and answer clarification questions if needed
3. Approve or refine the generated roadmap
4. Wait for Planning PR creation
5. Assign Instructional Issue to `@github-copilot`
6. Review complete documentation in Planning PR
7. Merge to establish planning baseline

## License

See repository license file for details.
