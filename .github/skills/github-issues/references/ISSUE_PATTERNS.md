# Issue Patterns

This document defines **generic, reusable issue patterns** for GitHub.
These patterns describe *structure and intent*, not repository-specific policy.

> **Note**
> If a repository provides concrete issue templates
> (for example via `.github/ISSUE_TEMPLATE/`),
> agents should **prefer those templates**.
> The patterns below act as:
>
> - a fallback when no templates exist
> - a validation guide
> - a conceptual reference for consistent issue creation

---

## Bug Report

**Intent**  
Report a defect, regression, or unexpected behavior.

**Suggested Title Pattern**  
`Bug: <short description>`

**Suggested Issue Type**
`Bug`

**Recommended Body Structure**

```markdown
## Description

Clear description of what happened.

## Steps to Reproduce

1. Step one
2. Step two
3. Step three

## Expected Behavior

What should have happened instead.

## Actual Behavior

What actually happened.

## Environment

- OS:
- Application version:
- Browser / Runtime (if applicable):

## Additional Context

Logs, screenshots, or related links.
````

---

## Feature Request

**Intent**
Propose new functionality or enhancements.

**Suggested Title Pattern**
`Feat: <feature name>`

**Suggested Issue Type**
`Feature`

**Recommended Body Structure**

```markdown
## Problem Statement

What problem are we trying to solve?

## User Story

As a <type of user>,
I want <desired capability>,
so that <expected benefit>.

## Proposed Solution

High-level description of the solution.
Avoid over-specifying implementation details unless necessary.

## Alternatives Considered

Other approaches that were considered (optional).

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

---

## Task / Chore

**Intent**
Track maintenance work, refactors, documentation updates, or operational tasks.

**Suggested Title Pattern**
`Chore: <task name>`
or
`Task: <task name>`

**Suggested Issue Type**
`Task`

**Typical Labels**
`maintenance`, `chore`, `task`

**Recommended Body Structure**

```markdown
## Goal

What needs to be done and why.

## Scope

What is included and explicitly excluded.

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Dependencies

Other issues, pull requests, or external factors (if any).
```

---

## Documentation Update

**Intent**
Track updates or improvements to documentation.

**Suggested Title Pattern**  
`Docs: <description>`

**Suggested Issue Type**
`Documentation` OR `Task`

**Typical Labels**
`documentation`

**Recommended Body Structure**

```markdown
## Summary

What documentation needs to be updated?

## Reason

Why this change is required.

## Affected Areas

Files, sections, or audiences impacted.

## Acceptance Criteria

- [ ] Documentation updated
- [ ] Links validated
```

---

## Usage Guidance for Agents

When creating or updating issues:

1. **Check for repository-specific templates**

   - If present, use them as the primary source of truth.
2. **Use these patterns as a fallback**

   - When templates are missing
   - When validating completeness
   - When reasoning about issue structure
3. **Do not assume labels or workflows**

   - Labels, automation, and required fields may vary by repository.

These patterns are intentionally **generic and adaptable**.
