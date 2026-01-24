---
name: dev-git-stash
description: Manage temporary state capture using Git stash for pause/resume workflows. Use when saving WIP state, switching contexts temporarily, or protecting uncommitted changes.
metadata:
  category: development
---

# Git Stash Manager

## What is it?

A skill that manages temporary state capture using Git stash, enabling quick context switching by storing uncommitted changes without creating commits. This provides a lightweight pause/resume mechanism for development workflows.

## Why use it?

- **Quick context switching**: Save current work and switch tasks without creating incomplete commits
- **State protection**: Safeguard uncommitted changes before potentially destructive operations
- **Fallback mechanism**: Alternative to worktrees when full isolation isn't needed

## How to use it?

### Step 1: Stash current changes

Save uncommitted work (tracked and untracked files) to the stash stack.

```bash
git stash push -u
```

**Flags:**

- `-u`: Include untracked files
- `-m "message"`: Add descriptive message (optional but recommended)

**Example:**

```bash
git stash push -u -m "WIP: half-complete authentication feature"
```

### Step 2: List stashed changes

View all saved stashes with their descriptions.

```bash
git stash list
```

**Output format:**

```
stash@{0}: On feature-x: WIP: half-complete authentication feature
stash@{1}: On main: experiment with new API
```

### Step 3: Inspect stash contents

View what's in a stash before applying it.

```bash
git stash show            # Summary of changes
git stash show -p         # Full diff of changes
git stash show stash@{n}  # Show specific stash
```

### Step 4: Apply stashed changes

Restore previously stashed work to your working directory.

```bash
git stash pop
```

**Alternatives:**

- `git stash apply`: Restore changes but keep them in stash
- `git stash pop stash@{n}`: Restore specific stash by index

### Step 5: Handle conflicts on pop

When popping a stash causes conflicts:

```bash
git stash pop
# Auto-merging file.js
# CONFLICT (content): Merge conflict in file.js

# Resolve conflicts manually
# Edit the conflicted files

# Stage resolved files
git add <resolved-files>

# The stash is NOT dropped on conflict - manually drop after resolution
git stash drop
```

**Note:** Unlike a clean pop, conflicts keep the stash in the list. Drop it manually after resolution.

### Step 6: Create branch from stash

Create a new branch from a stash (useful for complex stashes):

```bash
git stash branch <new-branch-name>
git stash branch <new-branch-name> stash@{n}
```

This creates a new branch from the commit where the stash was created, applies the stash, and drops it.

### Step 7: Partial/Interactive stashing

Stash only specific changes interactively:

```bash
git stash push -p
```

This shows each hunk and prompts:

- `y` - stash this hunk
- `n` - skip this hunk
- `s` - split into smaller hunks
- `q` - quit (stash selected hunks)

See [Git Interactive Staging Documentation](https://git-scm.com/book/en/v2/Git-Tools-Interactive-Staging) 

### Step 8: Clear stashes (optional)

Remove stashes that are no longer needed.

```bash
git stash drop stash@{n}  # Remove specific stash
git stash clear            # Remove all stashes
```

## Examples

### Scenario: Quick bug fix interruption

**Situation:** Working on feature when urgent bug report arrives.

```bash
# Save current work
git stash push -u -m "WIP: user profile component"

# Switch to main and fix bug
git checkout main
# ... make fix and commit ...

# Return to feature work
git checkout feature-branch
git stash pop
```

### Scenario: Testing clean state

```bash
# Stash changes to test if bug exists in clean state
git stash push -u

# Run tests on clean checkout
npm test

# If bug persists, it's not from your changes
# Restore work
git stash pop
```

### Scenario: Handling stash pop conflict

```bash
# Pop stash onto modified working tree
git stash pop

# CONFLICT - resolve manually
# Edit conflicted files...

# Stage resolved files
git add .

# Stash remains after conflict - drop it manually
git stash drop
```

### Scenario: Using git stash branch

```bash
# Complex stash that may conflict
git stash branch new-feature-from-stash

# Now on new branch with stash applied cleanly
git status
```

## Prerequisites

⚠️ **Safety Requirement**: Run `dev-git-inspector` before stashing to verify that the repository is in a safe, predictable state.

**Important**: Stash requires at least one commit in the repository. On empty repositories, stash will fail:

```bash
$ git stash push
fatal: You do not have the initial commit yet
```

## Supporting References

- [Git Stash Documentation](https://git-scm.com/docs/git-stash)
- Related skills: `dev-git-worktree` (for full isolation), `dev-git-commit-author`

## Limitations

- Stash is **not** a replacement for commits (temporary only, no history)
- Stashes are local and not pushed to remote repositories
- **Conflicts can occur when popping** stashed changes onto modified code - stash is NOT dropped on conflict
- Stash stack can become confusing without descriptive messages
- **Requires at least one commit** - stash will fail on empty repositories
- Stashed changes may become outdated if the branch evolves significantly

## When to Use Stash vs Worktree

See the detailed comparison: [references/stash-vs-worktree.md](references/stash-vs-worktree.md)
