# Planning Phases Reference

Detailed documentation for each phase of the requirement orchestration workflow.

---

## Phase 1 — Product Definition / Evolution

**Goal:** Capture product intent.

**Actions:**

1. Invoke **PRD Authoring Skill**
2. Receive PRD content
3. Create file: `docs/product/PRD.md`
4. Do **not** create a PR yet

> ⚠️ Files are written to disk, never to chat.

---

## Phase 2 — Ambiguity Resolution

**Goal:** Ensure zero unanswered decisions.

**Actions:**

1. Invoke **Ambiguity Detection Skill**
2. If ambiguities exist:
   - Create/update: `docs/planning/CLARIFICATIONS.md`
   - Stop downstream planning
3. Wait for human edits
4. Re-run ambiguity detection
5. Remove `CLARIFICATIONS.md` only if ambiguity count = zero
6. Continue only when ambiguity count = zero

> ⚠️ Questions must live in CLARIFICATIONS.md, never in chat.

---

## Phase 3 — Feature Surface Definition (Roadmap)

**Goal:** Define what exists (not how it is built).

### Roadmap Cleanliness Invariant

> `docs/product/implementation-roadmap.md` MUST be comment-free to be valid.
> The presence of ANY comment indicates an unresolved refinement.

### Steps

1. **Initial Generation**: Invoke Feature & Roadmap Decomposition Skill
2. **Human Review**: User adds inline comments for changes needed
3. **Refinement Loop**: Parse comments, apply transformations, regenerate clean files
4. **Approval**: Allowed only when roadmap has zero comments

### Evolution Mode Rule

DO NOT delete existing roadmap items. Append new features or bug fixes as a new Phase or Maintenance Block.

---

## Phase 4 — Planning Pull Request

**Goal:** Establish a reviewable planning baseline.

**Actions:**

1. Invoke **github-pr-flow** to:
   - Create branch: `docs/planning-baseline`
   - Push only: `docs/product/PRD.md` and `docs/product/implementation-roadmap.md`
   - Create PR with title: `docs: [mode] update planning baseline (PRD + Roadmap)`
2. Store the branch name for the Instructional Issue
3. Do NOT block on merge

> 🔒 Cloud agents will work on the same branch.

---

## Phase 5 — Instructional Issue

**Goal:** Instruct cloud agents to generate Epic & Feature documentation.

**Actions:**

1. Invoke **github-issues** to create issue with:
   - Title: `Generate epic and feature specifications from approved PRD`
   - Body: Instructions to work on `docs/planning-baseline` branch
2. STOP and hand off to user

### Required Issue Content

```markdown
## Target Branch
> Work on branch: `docs/planning-baseline`

## Required Skills
- PRD Authoring Skill (read-only)
- Feature Specification Skill
- Epic Definition Skill
- Dependency & Scope Analysis Skill

## Output Rules
- Epic docs: `docs/epics/`
- Feature docs: `docs/features/<bounded-context>/`
- Execution flow: `docs/execution/execution-flow.md`
- ❌ No IDs, No numbers, No PR creation
```

---

## Phase 6 — Human Handoff (Manual)

**Not automated.** Required human actions:

1. Navigate to the Instructional Issue
2. Assign to @github-copilot with branch selection
3. Wait for Copilot to complete
4. Review the updated Planning PR
5. Merge to main

---

## Phase 7 — Post-Merge Automation

After merge to main, a GitHub Action automatically:

1. Creates GitHub Issues for all new Epic/Feature documents
2. Assigns hierarchy via Sub-issue API
3. Synchronizes state (adds `issue_url`, renames files, repairs links)
4. Mirrors future markdown changes to issue bodies
