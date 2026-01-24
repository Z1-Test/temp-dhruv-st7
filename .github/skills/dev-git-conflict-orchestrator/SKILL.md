---
name: dev-git-conflict-orchestrator
description: Orchestrate conflict resolution by coordinating Git primitives with decision boundaries. Use when handling merge conflicts, cherry-pick collisions, or determining safe vs unsafe resolution.
metadata:
  category: development
---

# Git Conflict Orchestrator

## What is it?

A composite skill that orchestrates conflict resolution by coordinating Git primitive skills (`dev-git-cherry-pick`, `dev-git-commit-author`, etc.) with decision-making logic. This skill focuses on **when** and **how** to resolve conflicts, not on explaining Git internals.

## Why use it?

- **Structured decision-making**: Clear boundaries between safe automated resolution and human escalation
- **Risk management**: Prevents unsafe automatic conflict resolution
- **Workflow coordination**: Links multiple Git skills into coherent conflict handling flows

## How to use it?

### Step 1: Detect conflict state

Identify that a Git operation (merge, cherry-pick, rebase) is in a conflicted state.

**Indicators:**

```bash
git status
# Cherry-pick:
# You are currently cherry-picking commit a1b2c3d.
# Unmerged paths: ...

# Merge:
# You have unmerged paths.
# Unmerged paths: ...

# Rebase:
# You are currently rebasing branch 'feature' on 'main'.
# Unmerged paths: ...
```

**Operation-specific continue/abort commands:**

| Operation | Continue | Abort |
|-----------|----------|-------|
| Cherry-pick | `git cherry-pick --continue` | `git cherry-pick --abort` |
| Merge | `git commit` (after resolving) | `git merge --abort` |
| Rebase | `git rebase --continue` | `git rebase --abort` |

```

### Step 2: Classify the conflict

Determine conflict type and resolution strategy.

**Classification matrix:**

| Conflict Type | Auto-resolvable? | Action |
|--------------|------------------|--------|
| Simple whitespace/formatting | Yes | Auto-resolve |
| Non-overlapping changes | Yes | Auto-resolve |
| Logic conflicts | No | Escalate to human |
| Semantic conflicts | No | Escalate to human |

**Improved file classification (consider path AND extension):**

| Pattern | Classification | Action |
|---------|---------------|--------|
| `*.md`, `*.txt`, `docs/**` | Documentation | Auto-resolve (prefer --theirs) |
| `*.config.js`, `*.config.ts` | Configuration | **ESCALATE** (not just `.js`) |
| `*.env*`, `*.json`, `*.yaml` | Configuration | **ESCALATE** |
| `**/security/**`, `**/auth/**` | Security-critical | **ESCALATE** |
| `**/payment*/**`, `**/billing/**` | Payment-critical | **ESCALATE** |
| `*.test.js`, `*.spec.ts` | Test files | Auto-resolve if additive |
| Other source code | Code | Validate with tests |

**Important:** File extension alone is insufficient. `jest.config.js` is configuration, not regular code.

### Step 3: Apply resolution strategy

Execute appropriate resolution based on classification.

#### Safe (Auto-resolve):
```bash
# Accept incoming changes (theirs)
git checkout --theirs <file>

# Keep current version (ours)
git checkout --ours <file>
```

**⚠️ Warning:** During `rebase`, `--ours` and `--theirs` are swapped!

#### Unsafe (Escalate)

```bash
# Abort operation and notify human
git cherry-pick --abort
# Report: "Complex conflict detected, human review required"
```

### Step 4: Validate resolution

After resolution, verify the outcome.

```bash
# Run tests
npm test

# Check diff
git diff HEAD~1

# Verify build
npm run build
```

## Examples

### Scenario: Safe whitespace conflict

```bash
git cherry-pick a1b2c3d
# Conflict in formatting only
git status
# Unmerged paths: src/utils.js

# Resolve by accepting incoming formatting
git checkout --theirs src/utils.js
git add src/utils.js
git cherry-pick --continue
```

### Scenario: Complex logic conflict (escalate)

```bash
git cherry-pick b2c3d4e
git status
# Both modified: src/payment-processor.js

# Decision: ESCALATE
git cherry-pick --abort
echo "Conflict in payment logic detected. Manual review required."
```

### Scenario: Multi-file conflict workflow

```bash
# Detect conflict
git status

# Classify each file (improved pattern matching)
for file in $(git diff --name-only --diff-filter=U); do
  # Check for config files by pattern, not just extension
  if [[ "$file" =~ \.config\.(js|ts|json)$ ]] || \
     [[ "$file" =~ ^config/ ]] || \
     [[ "$file" =~ \.env ]]; then
    echo "Escalating: $file (configuration file)"
  elif [[ "$file" =~ \.(md|txt)$ ]] || [[ "$file" =~ ^docs/ ]]; then
    # Documentation: safe to auto-resolve
    git checkout --theirs "$file"
    git add "$file"
  elif [[ "$file" =~ (security|auth|payment|billing) ]]; then
    echo "Escalating: $file (critical path)"
  else
    # Code files: escalate for safety
    echo "Escalating: $file requires human review"
  fi
done

# Check if any files remain unresolved
if git diff --name-only --diff-filter=U | grep -q .; then
  git cherry-pick --abort
  exit 1
else
  git cherry-pick --continue
fi
```

### Scenario: Handling merge conflicts

```bash
# Merge feature into main
git checkout main
git merge feature-branch

# Conflict occurs
# Auto-merging src/app.js
# CONFLICT (content): Merge conflict in src/app.js

# Resolve conflicts
vim src/app.js
git add src/app.js

# Complete merge (no --continue, just commit)
git commit -m "merge: integrate feature-branch"
```

### Scenario: Handling rebase conflicts

```bash
# Rebase feature onto main
git checkout feature-branch
git rebase main

# Conflict occurs at commit 2 of 5
# CONFLICT (content): Merge conflict in src/app.js

# Resolve conflict
vim src/app.js
git add src/app.js

# Continue with remaining commits
git rebase --continue

# If giving up entirely
git rebase --abort
```

### Scenario: Empty cherry-pick after conflict resolution

```bash
# After resolving conflicts, no changes remain
git cherry-pick --continue
# The previous cherry-pick is now empty, possibly due to conflict resolution.

# Options:
git commit --allow-empty  # Keep empty commit for audit trail
# OR
git cherry-pick --skip    # Skip this commit, continue with others
```

## Prerequisites

⚠️ **Safety Requirement**: Run `dev-git-inspector` to verify repository state before attempting resolution.

## Supporting References

- [references/conflict-resolution-guide.md](references/conflict-resolution-guide.md) - Detailed resolution strategies and decision boundaries
- [Git Merge Documentation](https://git-scm.com/docs/git-merge)
- Related skills: `dev-git-cherry-pick`, `dev-git-commit-author`, `dev-git-stash`, `dev-git-inspector`

## Limitations

- **Does NOT explain**: Conflict markers, Git internals, merge algorithms
- **Only explains**: Decision logic, safety boundaries, when to escalate
- Cannot guarantee conflict-free resolution (complexity varies)
- Automated resolution rules are heuristics, not guarantees
- **File extension is insufficient**: Use path patterns for accurate classification (e.g., `jest.config.js` is config, not code)
- **Empty picks**: Conflict resolution may result in empty commits - handle with `--allow-empty` or `--skip`
- **Rebase gotcha**: `--ours`/`--theirs` are swapped during rebase operations
