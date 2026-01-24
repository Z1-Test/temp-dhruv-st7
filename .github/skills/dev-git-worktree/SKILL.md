---
name: dev-git-worktree
description: Manage isolated Git worktrees for parallel development. Use when creating development environments, switching contexts without stashing, or managing multiple active branches.
metadata:
  category: development
---

# Git Worktree Manager

## What is it?

A skill that manages the lifecycle of isolated Git worktrees, enabling parallel task development without the overhead of cloning or constant branch switching. Worktrees provide true context isolation by checking out different branches in separate directories.

## Why use it?

- **Parallel execution**: Work on multiple features, bugs, or experiments simultaneously without "dirty" working directory conflicts
- **Context isolation**: Keep experimental changes separate from stable work without stashing or committing incomplete work
- **Performance**: Eliminate rebuilding and re-indexing costs when switching between tasks

## How to use it?

### Step 1: Create a new worktree

Create an isolated environment for a new task.

```bash
git worktree add <path> <branch>
```

- `<path>`: Directory path for the new worktree (typically outside main repo, e.g., `../feature-x`)
- `<branch>`: Branch to check out (can be existing or new)

**Example:**

```bash
git worktree add ../bugfix-auth bugfix/auth-token
```

### Step 2: List active worktrees

View all current isolated environments and their states.

```bash
git worktree list
```

**Output shows:** path, branch, and commit SHA for each worktree.

### Step 3: Work in the isolated environment

Navigate to the worktree directory and perform your work normally.

```bash
cd <path>
# Make changes, commit, test
```

### Step 4: Remove a worktree

Clean up when the task is complete and changes are merged.

```bash
git worktree remove <path>
```

**Note:** Ensure all changes are committed or the branch is no longer needed.

### Step 5: Prune stale worktrees

Clean up worktree information for directories that were manually deleted.

```bash
git worktree prune
```

**When to use:**

- After manually deleting a worktree directory with `rm -rf`
- When `git worktree list` shows paths that no longer exist
- As periodic cleanup maintenance

### Step 6: Advanced Operations

See [references/advanced-operations.md](references/advanced-operations.md) for documentation on `lock`, `unlock`, and `move` operations.

## Examples

### Scenario: Hotfix while developing a feature

**Situation:** You're developing `feature-x` but need to fix a critical bug.

```bash
# Main worktree is on feature-x with uncommitted work
git worktree add ../hotfix-critical main

# Switch to hotfix directory
cd ../hotfix-critical

# Create fix branch and commit
git checkout -b hotfix/critical-bug
# ... make fixes ...
git commit -m "fix: resolve critical auth bug"

# Push and create PR
git push origin hotfix/critical-bug

# Return to feature work
cd -

# After hotfix is merged, cleanup
git worktree remove ../hotfix-critical
```

### Scenario: Testing experimental changes

```bash
# Create experimental worktree
git worktree add ../experiment-new-arch experiment/architecture

cd ../experiment-new-arch
# ... try new approach ...

# If successful, merge; if not, simply remove
cd -
git worktree remove ../experiment-new-arch
```

### Scenario: Cleaning up manually deleted worktrees

```bash
# Worktree was deleted manually with rm -rf
rm -rf ../old-worktree

# Git still thinks it exists
git worktree list
# /path/to/main  abc123 [main]
# /path/to/old-worktree  def456 [feature]  (error: missing)

# Prune to clean up
git worktree prune

# Now it's removed from tracking
git worktree list
# /path/to/main  abc123 [main]
```

## Prerequisites

⚠️ **Safety Recommendation**: Run `dev-git-inspector` to verify main workspace state before creating worktrees.

**Note:** Worktree creation does NOT strictly require a clean working tree in the main repository, but verifying state is recommended for safety.

## Supporting References

- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree)
- Related skills: `dev-git-stash` (fallback for context switching)

## Limitations

- Each branch can only be checked out in one worktree at a time
- Shared resources (like `.git/config`) are still shared across all worktrees
- Requires Git 2.5 or later (lock/move require Git 2.10+)
- Submodules require careful handling when used in worktrees
- **Manually deleted worktrees** leave stale entries - use `git worktree prune` to clean up
- Worktrees share the same object database; large repos benefit from this, but corruption affects all
