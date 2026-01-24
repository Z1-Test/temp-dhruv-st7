---
name: dev-git-inspector
description: Inspect Git repository state for safety checks. Use when verifying cleanliness, branch status, upstream divergence, or performing preflight validation.
metadata:
  category: development
  read-only: true
---

# Git Repository Inspector

## What is it?

A foundational, read-only inspection skill that answers: **"Is the repository in a safe and up-to-date state to proceed?"** This skill provides structured state reports without modifying the repository, enabling informed decision-making before executing Git operations.

## Why use it?

- **Safety-first**: Verify repository state before potentially destructive operations
- **Preflight validation**: Mandatory check for write-capable Git skills
- **State awareness**: Understand cleanliness, branch state, and upstream tracking without side effects
- **Machine-readable**: Structured output for programmatic consumption

## What this skill does

Inspects and reports on:

1. **Repository cleanliness**: Dirty vs clean working tree
2. **Branch & HEAD state**: Current branch or detached HEAD detection
3. **Upstream tracking**: Existence, ahead/behind counts (based on last fetch)
4. **Safety signal**: Overall assessment for proceeding with operations

## What this skill will NOT do

🚫 **Never performs write operations:**

- No `git fetch`, `git pull`, `git merge`
- No `git checkout`, `git stash`, `git commit`
- No `git rebase`, `git reset`, `git clean`
- No config modifications

🚫 **Never suggests actions or orchestration:**

- Does not recommend commands
- Does not decide workflows
- Only reports state objectively

## How to use it?

### Step 1: Inspect repository state

Run the inspection to get a structured state report.

```bash
git status --porcelain
git rev-parse --abbrev-ref HEAD
git rev-parse --verify HEAD
git branch -vv
```

### Step 2: Parse the output

The skill returns a structured report with the following contract:

```json
{
  "clean": boolean,
  "current_branch": string | null,
  "detached_head": boolean,
  "upstream": string | null,
  "ahead": number,
  "behind": number,
  "safe_to_proceed": boolean,
  "status_summary": string
}
```

**Field Descriptions:**

- `clean`: `true` if no uncommitted changes, `false` if working tree is dirty
- `current_branch`: Name of current branch (e.g., `"main"`) or `null` if detached
- `detached_head`: `true` if HEAD is detached from any branch
- `upstream`: Remote tracking branch (e.g., `"origin/main"`) or `null` if none
- `ahead`: Number of commits ahead of upstream (0 if none)
- `behind`: Number of commits behind upstream (0 if none)
- `safe_to_proceed`: Overall safety flag (`true` if clean, not behind, and not in a detached HEAD state)
- `status_summary`: Human-readable summary (e.g., `"Clean working tree on main, tracking origin/main, up-to-date"`)

### Step 3: Use the report for decision-making

Downstream skills and orchestrators can use this report to determine if it's safe to proceed.

**Example decision logic:**

```python
if report["safe_to_proceed"]:
    # Proceed with git operation
    execute_git_workflow()
else:
    # Handle unsafe state
    if not report["clean"]:
        print("Working tree has uncommitted changes")
    if report["behind"] > 0:
        print(f"Branch is {report['behind']} commits behind upstream")
```

## Examples

### Scenario: Clean repository, up-to-date

**Git state:**

```bash
$ git status --porcelain
# (empty output)

$ git rev-parse --abbrev-ref HEAD
main

$ git branch -vv
* main a1b2c3d [origin/main] feat: add new feature
```

**Report:**

```json
{
  "clean": true,
  "current_branch": "main",
  "detached_head": false,
  "upstream": "origin/main",
  "ahead": 0,
  "behind": 0,
  "safe_to_proceed": true,
  "status_summary": "Clean working tree on main, tracking origin/main, up-to-date"
}
```

### Scenario: Dirty working tree

**Git state:**

```bash
$ git status --porcelain
 M src/app.js
?? new-file.txt
```

**Report:**

```json
{
  "clean": false,
  "current_branch": "feature-x",
  "detached_head": false,
  "upstream": "origin/feature-x",
  "ahead": 2,
  "behind": 0,
  "safe_to_proceed": false,
  "status_summary": "Dirty working tree on feature-x, tracking origin/feature-x, 2 ahead"
}
```

### Scenario: Detached HEAD

**Git state:**

```bash
$ git rev-parse --abbrev-ref HEAD
HEAD

$ git status --porcelain
# (empty output)
```

**Report:**

```json
{
  "clean": true,
  "current_branch": null,
  "detached_head": true,
  "upstream": null,
  "ahead": 0,
  "behind": 0,
  "safe_to_proceed": false,
  "status_summary": "Clean working tree, detached HEAD, no upstream tracking"
}
```

### Scenario: Behind upstream

**Git state:**

```bash
$ git branch -vv
* main a1b2c3d [origin/main: behind 3] old commit
```

**Report:**

```json
{
  "clean": true,
  "current_branch": "main",
  "detached_head": false,
  "upstream": "origin/main",
  "ahead": 0,
  "behind": 3,
  "safe_to_proceed": false,
  "status_summary": "Clean working tree on main, tracking origin/main, 3 behind"
}
```

### Scenario: Empty repository (no commits)

**Git state:**

```bash
$ git rev-parse HEAD
fatal: ambiguous argument 'HEAD': unknown revision or path not in the working tree.

$ git status --porcelain
?? README.md
```

**Handling:** An empty repository (no commits yet) requires special handling. The `git rev-parse HEAD` command will fail.

**Report:**

```json
{
  "clean": false,
  "current_branch": null,
  "detached_head": false,
  "upstream": null,
  "ahead": 0,
  "behind": 0,
  "safe_to_proceed": false,
  "status_summary": "Empty repository - no commits yet, untracked files present",
  "empty_repo": true
}
```

**Detection approach:**

```bash
# Check if repository has any commits
if ! git rev-parse HEAD >/dev/null 2>&1; then
  echo "Empty repository detected"
fi
```

## Output Contract

### Required Fields

All reports MUST include these fields:

| Field | Type | Description |
|-------|------|-------------|
| `clean` | `boolean` | Working tree is clean |
| `current_branch` | `string \| null` | Branch name or null |
| `detached_head` | `boolean` | HEAD is detached |
| `upstream` | `string \| null` | Tracking branch or null |
| `ahead` | `number` | Commits ahead of upstream |
| `behind` | `number` | Commits behind upstream |
| `safe_to_proceed` | `boolean` | Safe for operations |
| `status_summary` | `string` | Human-readable summary |

### Interpretation Guidelines

**`safe_to_proceed` is `true` when:**

- Working tree is clean (`clean: true`)
- Not behind upstream (`behind: 0`)
- Not in detached HEAD state (for most workflows)

**`safe_to_proceed` is `false` when:**

- Uncommitted changes exist
- Branch is behind upstream (potential conflicts)
- Detached HEAD state (context unclear)

## Integration with Other Skills

This skill serves as a **foundational dependency** for write-capable Git skills:

### Recommended Workflow

```
1. Run git-inspector (preflight check)
2. If safe_to_proceed: true
   → Execute git-commit-author, git-cherry-pick, etc.
3. If safe_to_proceed: false
   → Use git-stash or git-worktree to resolve state
```

### Skills that should reference git-inspector

- `dev-git-commit-author` - Before staging/committing
- `dev-git-cherry-pick` - Before applying commits
- `dev-git-worktree` - To verify main workspace state
- `dev-git-conflict-orchestrator` - Before resolution attempts

## Supporting References

- [Git Status Documentation](https://git-scm.com/docs/git-status)
- [Git Branch Documentation](https://git-scm.com/docs/git-branch)
- Related skills: `dev-git-commit-author`, `dev-git-cherry-pick`, `dev-git-worktree`

## Limitations

- **No fetching**: Upstream comparison uses last fetch data (may be stale). Run `git fetch` separately if fresh upstream data is needed
- **Stale upstream data**: The `ahead`/`behind` counts reflect the state at last fetch. If you need current remote status, fetch first: `git fetch origin`
- **Read-only**: Cannot fix unsafe states, only report them
- **No orchestration**: Does not suggest remediation steps
- **Stateless**: Each invocation is independent, no state tracking
- **No complex analysis**: Does not interpret commit history or conflicts
- **Empty repository edge case**: Repositories with no commits will fail on `git rev-parse HEAD` - check for this condition first

## JSON Generation Script

A shell script that generates the JSON output is available at:

```
scripts/inspect.sh
```

Run it from any Git repository to get a structured JSON report:

```bash
./scripts/inspect.sh
```

The script handles all edge cases including empty repositories and detached HEAD states.
