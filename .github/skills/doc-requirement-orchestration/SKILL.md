---
name: doc-requirement-orchestration
description: Orchestrate planning workflows from PRD to feature specifications. Use when coordinating product requirements, resolving ambiguities, creating roadmaps, and delegating documentation to cloud agents via GitHub PRs and issues.
metadata:
  category: documentation
---

# Requirement Orchestration

## What is it?

A control-plane skill that coordinates the transformation of **approved product intent** into **structured, reviewable documentation**. It orchestrates Agent Skills, cloud agents, and human approvals through a deterministic, auditable workflow.

The skill acts as a **coordinator**—it enforces invariants, decides when PRs and issues are created, and delegates content generation to specialized skills.

## Why use it?

- **End-to-end planning coordination**: Manage all phases from PRD creation to specification generation
- **Docs-first workflow**: Ensure documentation precedes execution
- **Async cloud delegation**: Offload large documentation work to cloud agents via instructional issues
- **Human approval gates**: Enforce review checkpoints at critical stages
- **Deterministic flow**: Same inputs produce same outputs—fully auditable

## Available Skills

### Product Intelligence Skills

- **PRD Authoring Skill**
- **Ambiguity Detection Skill**
- **Feature & Roadmap Decomposition Skill**
- **Feature Specification Skill**
- **Gherkin Authoring Skill**
- **Change Maintenance Specification Skill**
- **Epic Definition Skill**
- **Dependency & Scope Analysis Skill**

### GitHub Operations Skills

- **github-kernel** — safety rules & tool selection
- **github-issues** — issue lifecycle & Copilot assignment
- **github-pr-flow** — branch & PR lifecycle

> Select skills automatically based on phase requirements.

## How to use it?

### Step 1: Determine Project Mode

Check if `docs/product/PRD.md` exists:

| Mode | Condition | Goal |
|------|-----------|------|
| **Bootstrap** | PRD does NOT exist | Establish initial baseline |
| **Evolution** | PRD already exists | Manage deltas, new features, or bug fixes |

### Step 2: Execute Planning Phases

Follow the 7-phase workflow in order:

1. **Product Definition** — Invoke PRD Authoring Skill, write to `docs/product/PRD.md`
2. **Ambiguity Resolution** — Use Ambiguity Detection Skill, create `docs/planning/CLARIFICATIONS.md` if needed
3. **Roadmap Definition** — Generate implementation roadmap, handle inline comment refinements
4. **Planning PR** — Create branch `docs/planning-baseline`, push PRD + roadmap
5. **Instructional Issue** — Create issue instructing cloud agents to generate specs
6. **Human Handoff** — User assigns issue to @github-copilot on the planning branch (MANUAL)
7. **Post-Merge Automation** — GitHub Action syncs docs to issues (AUTOMATED)

> 🛑 **Orchestrator stops at Phase 5.** Phases 6-7 require human action and automation.

### Step 3: Coordinate Skills

Invoke skills based on phase requirements:

| Phase | Skills Used |
|-------|-------------|
| PRD | PRD Authoring Skill |
| Ambiguity | Ambiguity Detection Skill |
| Roadmap | Feature & Roadmap Decomposition Skill |
| Specs | PRD Authoring (read-only), Feature Specification, Epic Definition, Gherkin Authoring, Dependency & Scope Analysis |
| Maintenance | Change Maintenance Specification Skill |
| GitHub | github-kernel, github-issues, github-pr-flow |

## Handoff Prompts

Use these prompts to trigger workflow transitions:

| Label | Trigger |
|-------|---------|
| **✅ Clarifications Updated** | User has answered questions in `CLARIFICATIONS.md` |
| **🔄 Refine Roadmap** | Process inline roadmap comments and regenerate |
| **🚀 Roadmap Approved** | Roadmap is comment-free, create PR and issue |

## Key Invariants

> [!IMPORTANT]
> The orchestrator enforces these rules at all times:

- Docs precede execution
- Intent is human-reviewed
- Only one planning PR exists at a time
- `implementation-roadmap.md` must be comment-free to be approved
- Cloud agents are stateless and never create PRs/issues
- Epics group execution only—not content

## Failure Handling

If any invariant is violated:

1. **Halt progression** immediately
2. **Surface the violation** clearly to the user
3. **Request human intervention** before continuing

## Examples

### Completion Output

After Phase 5, output this to the user and STOP:

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

- Continue beyond Phase 5
- Wait for PR merge
- Wait for issue assignment
- Attempt to generate documentation itself
- Create additional issues or PRs

## Limitations

- Does NOT write PRD, roadmap, epic, or feature content (delegates to skills)
- Does NOT decide business intent or feature behavior
- Does NOT store state between runs
- **Stops at Phase 5** — human handoff required for cloud agent assignment
- Does NOT wait for PR merge or assignment
- Does NOT generate documentation itself

## Post-Orchestrator Flow

After the orchestrator stops at Phase 5:

**Phase 6 (Human Manual Steps):**
1. Switch to `docs/planning-baseline` branch
2. Assign Instructional Issue to @github-copilot
3. Review and merge Planning PR

## Supporting References

- [planning-phases.md](references/planning-phases.md) — Detailed phase documentation
