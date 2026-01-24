---
name: dev-git-cherry-pick
description: Apply specific git commits across branches using cherry-pick, manage conflicts, and handle success or abort outcomes. Use when migrating commits between branches, distributing fixes, or resolving cherry-pick conflicts.
metadata:
  category: development
---

# Git Cherry-Pick Manager

## What is it?

A skill that enables selective commit application across different branches. Cherry-picking allows migrating specific commits without merging entire branches, with explicit handling of success, conflict, and abort states.

## Why use it?

- **Selective migration**: Apply specific fixes or features to multiple branches without full merges
- **Hotfix distribution**: Quickly apply critical fixes across release branches
- **Controlled integration**: Choose exactly which changes to bring into a branch

## How to use it?

### Step 1: Identify the commit to cherry-pick

Find the commit SHA you want to apply.

```bash
git log --oneline
```

Copy the commit SHA (e.g., `a1b2c3d`).

### Step 2: Cherry-pick the commit

Apply the selected commit to your current branch.

```bash
git cherry-pick <commit-sha>
```

**Example:**

```bash
git cherry-pick a1b2c3d
```

**Useful flags:**

- `-x`: Append "(cherry picked from commit...)" to message for traceability
- `--no-commit`: Apply changes without creating a commit (useful for combining multiple picks)
- `-e` or `--edit`: Edit commit message before committing

**Example with traceability:**

```bash
git cherry-pick -x a1b2c3d
# Creates: "fix: resolve bug
#
# (cherry picked from commit a1b2c3d...)"
```

### Step 2b: Cherry-pick range

```markdown
### Cherry-pick range
git cherry-pick A^..B  # Applies commits from A (inclusive) to B
```

**Outcome states:**
- **Success**: Commit applies cleanly
- **Conflict**: Requires manual resolution
- **Abort needed**: Unrecoverable state, must abort

### Step 3: Handle conflicts (if they occur)

When conflicts arise, Git pauses the cherry-pick.

**Check conflict status:**

```bash
git status
```

**Resolve conflicts:**

1. Edit conflicted files
2. Stage resolved files: `git add <file>`
3. Continue: `git cherry-pick --continue`

**Alternatively, abort:**

```bash
git cherry-pick --abort
```

**Skip current commit (in multi-pick):**

```bash
git cherry-pick --skip
```

Use `--skip` when:

- The current commit's changes already exist in the target branch
- The conflict resolution results in no changes (empty pick)
- You want to skip one commit in a range and continue with others

### Step 3b: Handle empty cherry-pick

If a changes already exist, Git warns the pick is empty.
```bash
git cherry-pick --skip        # Skip this commit (recommended)
git commit --allow-empty    # Keep empty commit for audit trail
git cherry-pick --abort       # Cancel entire operation
```

### Step 4: Verify the result

Check that the commit was applied correctly.

```bash
git log --oneline -n 3
git diff HEAD~1
```

## Examples

### Scenario: Applying hotfix to multiple branches

**Situation:** Critical fix committed to `main`, need on release branches.

```bash
# On main, identify fix commit
git log --oneline
# Output: d4e5f6g fix(auth): prevent token expiration bug

# Switch to release branch
git checkout release-2.1
git cherry-pick d4e5f6g

# Repeat for other releases
git checkout release-2.0
git cherry-pick d4e5f6g
```

### Scenario: Handling cherry-pick conflict

```bash
# Attempt cherry-pick
git cherry-pick a1b2c3d

# Conflict occurs
# Auto-merging src/app.js
# CONFLICT (content): Merge conflict in src/app.js

# Check status
git status

# Resolve conflict in editor
vim src/app.js

# Stage resolved file
git add src/app.js

# Continue cherry-pick
git cherry-pick --continue
```

### Scenario: Aborting failed cherry-pick

```bash
git cherry-pick a1b2c3d
# Conflicts are too complex

# Abort and return to original state
git cherry-pick --abort
```

### Scenario: Cherry-pick with traceability

```bash
# Use -x flag to record source commit
git cherry-pick -x d4e5f6g

# Resulting commit message includes:
# (cherry picked from commit d4e5f6g...)
```

### Scenario: Cherry-pick range of commits

```bash
# Apply commits from feature branch to release
git checkout release-2.1
git cherry-pick abc123^..def456

# This applies all commits from abc123 to def456 (inclusive)
```

### Scenario: Combine multiple cherry-picks

```bash
# Use --no-commit to stage without committing
git cherry-pick --no-commit a1b2c3d
git cherry-pick --no-commit b2c3d4e

# Create single combined commit
git commit -m "feat: combined feature from multiple commits"
```

## Prerequisites

⚠️ **Required**: Run `dev-git-inspector` before cherry-picking to verify the repository is in a clean, safe state.

## Supporting References

- [Git Cherry-Pick Documentation](https://git-scm.com/docs/git-cherry-pick)
- Related skills: `dev-git-conflict-orchestrator`, `dev-git-commit-author`

## Limitations

- Cherry-picking creates **new commits** (different SHAs), not true duplicates
- Repeated cherry-picks can create confusing history
- Conflicts are common when branch histories have diverged significantly
- Does **not** handle conflict resolution logic itself (see `dev-git-conflict-orchestrator`)
- **Empty cherry-picks**: If the target branch already contains the changes, the pick becomes empty
- **Range order matters**: Use `A^..B` syntax carefully; commits must be in ancestor order
