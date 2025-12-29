---
name: github-issues
description: manage the lifecycle of GitHub Issues, including creation, triage, milestones, search, and sub-issue hierarchy
---

## What is it?

This skill manages the **lifecycle of GitHub Issues**. It handles creation, triage (assignment), milestones, exploration (reading/searching), and hierarchy (sub-issues).

## Success Criteria

- Issues are created with appropriate titles and descriptive bodies.
- Milestones are used to group issues into actionable releases or sprints.
- `type` (Bug, Feature, Task) is correctly assigned when supported.
- Sub-issues are linked using numeric parent numbers and string child IDs.
- Search queries are specific to avoid hitting rate limits.

## When to use this skill

- "Create a bug report for X."
- "What are the open issues assigned to me?"
- "Create a milestone for V1.0."
- "Add issue #42 to the 'Beta' milestone."
- "Break this task down into sub-issues."
- "Assign Copilot to fix issue #123."

## What this skill can do

- **Create/Update**: Open new issues, close completed ones, update descriptions.
- **Planning**: Create and list milestones, assign issues to milestones.
- **Triage**: Assign users, Assign Copilot.
- **Explore**: Search specific issues, read comments, list issue types.
- **Hierarchy**: Create and manage sub-issues (tracking lists).
- **Dependencies**: explicit blocking relationships using REST API (see [DEPENDENCIES.md](references/DEPENDENCIES.md)).

## What this skill will NOT do

- Create Pull Requests (use `github-pr-flow`).
- Modify code (use `github-pr-flow`).
- Create repositories.

## How to use this skill

1. **Identify Intent**: Are we creating, reading, or modifying?
2. **Select Tool**: Use [MCP_TOOL_MAP](../github-kernel/references/MCP_TOOL_MAP.md).
3. **Execute**: Call the corresponding MCP tool function.

## Tool usage rules

- **Issue Type**: Always specify a `type` (e.g., "Bug", "Feature", "Task") when creating issues. Use `list_issue_types` to see valid values. If `list_issue_types` returns empty or the organization doesn't support issue types, omit the `type` parameter.
- **MCP First**: Use `issue_write`, `issue_read`, `search_issues`, `list_issue_types`.
- **Sub-issues**: Use `sub_issue_write` to link parent/child issues. The `sub_issue_id` parameter requires the issue **ID** (e.g., `I_kwDOABC123`), not the issue number. Use `issue_read` to get the ID from an issue number.
- **Milestones**:
  - **Milestones**: Use `gh api` to list/create. Use `gh issue edit` (CLI) or `issue_write` (MCP) to assign.
  - **Discovery**: Use `gh api /repos/{owner}/{repo}/milestones` (via `run_command`) to list existing milestones and find their **number**.
  - **Creation**: Use `gh api -X POST /repos/{owner}/{repo}/milestones -f title="title"` to create new ones.
  - **Assignment**:
    - **MCP**: Use `issue_write` with the `milestone` parameter (integer).
    - **CLI**: Use `gh issue edit <number> --milestone "title"` for title-based assignment.
- **Issue Types**: Types are **MANDATORY**. Use `list_issue_types` to find valid types (e.g. "Bug 🐞"). You **MUST** use `issue_write` (MCP) with the `type` parameter (exact name) to create issues. Do NOT use `gh issue create` if a type is required.
- **Issue Dependencies**:
  - **Method**: Use `gh api` REST endpoints as described in [DEPENDENCIES.md](references/DEPENDENCIES.md).
  - **IDs**: Adding or removing dependencies requires the **database ID** (integer) of the blocking issue. Use `issue_read` to find the `id` field.
- **Copilot**: Use `assign_copilot_to_issue` to start an AI session on an issue.

## Examples

See [references/examples.md](references/examples.md) for compliant issue management examples.

## Limitations

- Cannot see deleted issues.
- Rate limits apply to search queries.
