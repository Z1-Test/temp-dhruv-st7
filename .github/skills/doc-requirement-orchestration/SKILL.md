---
name: doc-requirement-orchestration
description: Orchestrate planning workflows from PRD to feature specifications. Use when coordinating product requirements, resolving ambiguities, creating roadmaps, and delegating documentation to cloud agents via GitHub PRs and issues.
license: Apache-2.0
metadata:
  author: staytuned
  version: "1.0"
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
6. **Human Handoff** — User assigns issue to @github-copilot on the planning branch
7. **Post-Merge Automation** — GitHub Action syncs docs to issues

### Step 3: Coordinate Skills

Invoke skills based on phase requirements:

| Phase | Skills Used |
|-------|-------------|
| PRD | PRD Authoring Skill |
| Ambiguity | Ambiguity Detection Skill |
| Roadmap | Feature & Roadmap Decomposition Skill |
| Specs | Feature Specification, Epic Definition, Gherkin Authoring |
| GitHub | github-kernel, github-issues, github-pr-flow |

## Key Invariants

> [!IMPORTANT]
> The orchestrator enforces these rules at all times:

- Docs precede execution
- Intent is human-reviewed
- Only one planning PR exists at a time
- `implementation-roadmap.md` must be comment-free to be approved
- Cloud agents are stateless and never create PRs/issues
- Epics group execution only—not content

## Examples

### Completion Output

After Phase 5, output this to the user and STOP:

```text
✅ Planning coordination complete.

Next steps (manual):

1. Navigate to the Instructional Issue: [Link]
2. Assign to @github-copilot (select branch: docs/planning-baseline)
3. After Copilot completes, review the Planning PR
4. Merge to main
```

## Limitations

- Does NOT write PRD, roadmap, epic, or feature content (delegates to skills)
- Does NOT decide business intent or feature behavior
- Does NOT store state between runs
- Stops at Phase 5—human handoff required for cloud agent assignment

## Supporting References

- [planning-phases.md](references/planning-phases.md) — Detailed phase documentation
