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

### Step 1 — Initial Generation

1. Invoke **Feature & Roadmap Decomposition Skill**
2. Write a clean roadmap to `docs/product/implementation-roadmap.md`
3. No comments, no TODOs, no annotations

### Step 2 — Human Review (Inline Comments)

- User reviews the roadmap directly
- If changes are needed, user adds inline comments:

```md
<!-- split this feature -->
<!-- move to later phase -->
```

At this point, the roadmap is **invalid and unapproved**.

### Step 3 — 🔄 Refine Roadmap (Comment-Driven)

When **Refine Roadmap** is triggered:

1. Parse `implementation-roadmap.md`
2. Detect and extract all comments
3. If ZERO comments exist:
   - Report: "No refinements detected"
   - Present 🚀 Roadmap Approved
   - STOP
4. If comments exist:
   - Interpret each comment
   - Apply all transformations in a single pass
   - Regenerate both `implementation-roadmap.md` and `PRD.md`
   - Strip ALL comments
   - Write clean files back to disk
   - Present refinement/approval options again

> Comments are single-use control signals and MUST NOT persist.

### Step 4 — Approval Condition

🚀 **Roadmap Approved** is allowed ONLY when:

- `implementation-roadmap.md` contains zero comments
- `CLARIFICATIONS.md` does not exist
- PRD and Roadmap are synchronized

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
> ❗ Only final merge to `main` is required after all documentation is complete.

---

## Phase 5 — Instructional Issue

**Goal:** Instruct cloud agents to generate Epic & Feature documentation.

**This phase begins immediately after the Planning PR is created.**

### Actions

1. Invoke **github-issues** to create issue with:
   - Title: `Generate epic and feature specifications from approved PRD`
   - Type: Task / Documentation (repo-defined)
   - Body: Full instructions (below)
   - MUST include: Explicit instruction to work on the Planning PR branch
2. STOP and hand off to user

---

### Instructional Issue — REQUIRED CONTENT

#### Target Branch

> **Work on branch:** `docs/planning-baseline`
>
> All generated documentation MUST be committed to this branch.
> Do NOT create a new branch or PR.
> Do NOT merge to main.

---

#### Instructional Purpose

> Generate **Epic and Feature specification documents** based on the approved PRD and Implementation Roadmap.
>
> **In Evolution Mode:**
> - Only generate specs for **newly added** features.
> - If an existing feature is modified, use the **Change Maintenance Specification Skill** to update the existing document.
> - Regenerate the **single execution flow document** to incorporate these changes into the global dependency graph.

---

#### Required Skills

- PRD Authoring Skill (read-only)
- Feature Specification Skill
- Epic Definition Skill
- Gherkin Authoring Skill
- Dependency & Scope Analysis Skill

---

#### Bounded Context & Epic Mapping (MANDATORY)

Bounded context and Epic assignment MUST be explicit.

Example:

```text
Epic: Auth System
  - Feature A
  - Feature B

Epic: Billing Engine
  - Feature C
```

**Source of truth:**

- Use **only** the epics and bounded contexts as written in `docs/product/implementation-roadmap.md`.
- Cloud agents MUST include `parent_epic: "<Epic Name>"` in the metadata of every Feature document.
- If a feature lists multiple bounded contexts, treat the **first context listed** as the **primary** context for folder placement under: `docs/features/<bounded-context>/`
- Cloud agents MUST NOT infer new contexts, rename contexts, or re-order contexts.

---

#### Epic Creation Workflow (CRITICAL)

> [!IMPORTANT]
> You MUST create Epic documents for EVERY Epic listed in the Implementation Roadmap.

**Process:**

1. Read `docs/product/implementation-roadmap.md`
2. Identify all Epics
3. For each Epic, CREATE an Epic document using the **Epic Definition Skill**
4. Epic documents exist to group features for execution

**Example:**

If `implementation-roadmap.md` contains:

```text
Epic: Auth System
  - User Login
  - Password Reset

Epic: Billing Engine
  - Payment Processing
```

You MUST create:
- `docs/epics/auth-system.md`
- `docs/epics/billing-engine.md`
- `docs/features/auth/user-login.md`
- `docs/features/auth/password-reset.md`
- `docs/features/billing/payment-processing.md`

---

#### Output Rules (STRICT)

**You MUST create the following documents:**

1. **Epic documents** for each Epic in `implementation-roadmap.md`:
   - Location: `docs/epics/`
   - Use: Epic Definition Skill
   - Naming: `<epic-name>.md` (e.g., `auth-system.md`)
   - One Epic doc per Epic in roadmap

2. **Feature documents** for each Feature under each Epic:
   - Location: `docs/features/<bounded-context>/`
   - Use: Feature Specification Skill
   - Naming: `<feature-name>.md` (e.g., `user-login.md`)
   - Include `parent_epic: "<Epic Name>"` in frontmatter

3. **Execution flow document**:
   - Location: `docs/execution/execution-flow.md`
   - Use: Dependency & Scope Analysis Skill
   - Single document for entire project

**Naming Rules:**
- Use **names only**, NOT issue numbers
- Issue numbers added during post-merge automation
- ❌ No IDs in filenames
- ❌ No PR creation
- ❌ No issue creation
- ❌ No file renaming

---

#### Execution Flow Document (REQUIRED)

The execution flow document MUST:

- Describe feature execution order
- Explicitly state dependencies
- Explicitly state which features may execute in parallel
- Be derived ONLY from the ordering defined in this issue
- Use feature **names only**, NOT issue numbers
- Contain NO implementation details
- Contain NO filenames with numeric prefixes
- Contain `## Authoritative Execution Plan` section with JSON content

**Critical constraint:**

> This file is a system-level execution contract.
> It must NOT be created by feature or epic skills independently.
> It must reflect the execution order specified in this issue exactly.

---

#### Remote Config Flag Template

For features requiring remote config flags, use this table format:

```markdown
| Context | Type | Namespace | Default (Dev) | Default (Stg) | Default (Prod) | Key |
|---------|------|-----------|---------------|---------------|----------------|-----|
| <flag_context> | BOOLEAN | client | true | false | false | _auto-generated_ |
<!-- REMOTE_CONFIG_FLAG_END -->
```

> The `Key` field MUST always be `_auto-generated_` as the actual key will be generated by automation after PR merge.

---

#### Authoritative Execution Plan

```json
{
  "execution_plan": [
    {
      "epic": "Epic Name",
      "features": [
        { "name": "Feature A", "id": "Feature 1" },
        { "name": "Feature B", "id": "Feature 2", "depends_on": ["Feature 1"] }
      ]
    }
  ]
}
```

---

#### Prohibitions (EXPLICIT)

Cloud agents MUST NOT:

- Create PRs
- Create issues
- Assign numbers
- Reference workflows
- Mutate system state

---

### Completion Output

Before stopping, generate a **Short Report** summarizing:

- Final PRD status
- Implementation Roadmap features count
- Next immediate actions

Then output:

```text
✅ Planning coordination complete.

Next steps (manual):

1. Navigate to the Instructional Issue: [Link]
2. Assign to @github-copilot:
   - CRITICAL: Switch your local branch to `docs/planning-baseline`
   - Copilot will generate Epic, Feature, and Execution Flow docs
3. After Copilot completes, review the Planning PR
4. Merge to main

🛑 The orchestrator's role ends here.
```

**The orchestrator MUST NOT:**

- Continue beyond this point
- Wait for PR merge
- Wait for issue assignment
- Attempt to generate documentation itself
- Create additional issues or PRs

> Human approval and cloud agent assignment are required next.

---

## Phase 6 — Human Handoff (Manual)

> [!IMPORTANT]
> **This phase is NOT performed by the orchestrator.**
> The orchestrator has stopped at Phase 5.

**Required human actions:**

1. Navigate to the Instructional Issue
2. **Switch local branch** to `docs/planning-baseline`
3. Assign issue to @github-copilot with branch selection:
   - Select branch: `docs/planning-baseline`
   - Cloud agent will add documentation to the same branch
4. Wait for Copilot to complete documentation generation
5. Review the updated Planning PR:
   - Now contains: PRD, Roadmap, Epics, Features, Execution Flow
   - Verify all specs use feature names (NOT issue numbers)
6. Merge the Planning PR to `main`