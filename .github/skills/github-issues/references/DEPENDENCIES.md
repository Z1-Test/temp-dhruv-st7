# Issue Dependencies

Manage `blocked_by` and `blocking` relationships between issues using the GitHub REST API.

## Capabilities

* **Mark as Blocked**: Issue A cannot be closed until Issue B is closed.
* **Search**: Find blocked or blocking issues using standard filters.
* **Inspect**: List dependencies an issue is blocked by or blocking.

## Search Filters

Use these in `search_issues` (MCP) or `gh issue list`.

* `is:blocked`: Issues that are blocked by others.
* `is:blocking`: Issues that are blocking others.
* `blocked-by:<number>`: Issues blocked by a specific issue #.
* `blocking:<number>`: Issues blocking a specific issue #.

## Managing Relationships (REST API)

The REST API is the preferred method for managing issue dependencies.

### List dependencies an issue is blocked by

```bash
gh api /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by
```

### Add a dependency an issue is blocked by

```bash
gh api -X POST /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by \
  -f issue_id=<blocker_issue_id>
```

*Note: Use the **database ID** (integer), not the issue number.*

### Remove a dependency an issue is blocked by

```bash
gh api -X DELETE /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by/<blocker_issue_id>
```

### List dependencies an issue is blocking

```bash
gh api /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocking
```
