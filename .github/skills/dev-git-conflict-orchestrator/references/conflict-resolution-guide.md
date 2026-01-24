# Conflict Resolution Guide

This reference provides detailed strategies for resolving Git conflicts in the context of the `dev-git-conflict-orchestrator` skill.

## Conflict Classification Framework

### Level 1: Trivial (Auto-resolvable)

**Characteristics:**

- No functional impact
- Purely cosmetic differences
- Clear correct choice

**Examples:**

- Whitespace (tabs vs spaces, line endings)
- Code formatting (prettier, eslint --fix)
- Import ordering
- Trailing commas

**Resolution Strategy:**

```bash
# Accept formatting from target branch
git checkout --ours <file>
# OR accept incoming formatting
git checkout --theirs <file>

git add <file>
git cherry-pick --continue
```

---

### Level 2: Simple (Auto-resolvable with validation)

**Characteristics:**

- Non-overlapping logic changes
- Additive changes (no deletions)
- Independent file sections

**Examples:**

- New functions added in different locations
- New imports for different modules
- Documentation updates in separate sections

**Resolution Strategy:**

```bash
# Merge both changes
git merge-file <file>
# OR manually combine
# Edit file to include both changes

# Validate with tests
npm test

git add <file>
git cherry-pick --continue
```

---

### Level 3: Complex (Escalate)

**Characteristics:**

- Overlapping logic modifications
- Conflicting deletions
- Semantic meaning changes

**Examples:**

- Both sides modify same function logic
- Variable renamed in one, used differently in other
- API contract changes
- Database schema conflicts

**Resolution Strategy:**

```bash
# ABORT - do not auto-resolve
git cherry-pick --abort

# Escalate to human with context
echo "⚠️ Complex conflict requires human review"
echo "File: <file>"
echo "Reason: Overlapping logic changes"
```

---

## Resolution Decision Tree

```
Conflict Detected
│
├─ Operation Type?
│  ├─ Cherry-pick → continue: git cherry-pick --continue
│  ├─ Merge → continue: git commit
│  └─ Rebase → continue: git rebase --continue
│
├─ File Type?
│  ├─ Documentation (.md, .txt, docs/**)
│  │  └─ → Auto-resolve (Level 1)
│  │
│  ├─ Configuration (*.config.*, .env*, *.json, *.yaml, config/**)
│  │  └─ → ESCALATE (Level 3)
│  │
│  ├─ Critical Paths (security/**, auth/**, payment/**, billing/**)
│  │  └─ → ESCALATE (Level 3)
│  │
│  └─ Source Code (.js, .ts, .py, etc.)
│     └─ Is it a config file? (*.config.js, jest.config.ts)
│        ├─ Yes → ESCALATE (Level 3)
│        └─ No → Changes Overlap?
│           ├─ No → Auto-resolve with validation (Level 2)
│           └─ Yes → ESCALATE (Level 3)
```

## File-Type Specific Rules

### Documentation Files

- **Rule**: Always auto-resolve
- **Strategy**: Prefer `--theirs` (incoming changes)
- **Reasoning**: Docs are low-risk, latest content preferred
- **Patterns**: `*.md`, `*.txt`, `docs/**`, `README*`

### Configuration Files

- **Rule**: Always escalate
- **Strategy**: Abort and require human review
- **Reasoning**: Config errors can break production
- **Patterns**: `*.config.*`, `.env*`, `*.json`, `*.yaml`, `config/**`

### Critical Path Files

- **Rule**: Always escalate (highest priority)
- **Strategy**: Never auto-resolve, require human review
- **Reasoning**: Security, authentication, and payment logic requires expert review
- **Patterns**: `**/security/**`, `**/auth/**`, `**/payment/**`, `**/billing/**`

### Test Files

- **Rule**: Escalate if logic conflicts, auto-resolve if additive
- **Strategy**: If both added tests, merge; if modified same test, escalate
- **Patterns**: `*.test.*`, `*.spec.*`, `__tests__/**`

### Source Code

- **Rule**: Use validation-based resolution
- **Strategy**: Merge if non-overlapping + tests pass, else escalate
- **Important**: Check if it's actually a config file (e.g., `jest.config.js`)

## Validation Requirements

After any auto-resolution, perform:

1. **Syntax Check**: Ensure code parses
2. **Linting**: Run style checks
3. **Unit Tests**: All tests must pass
4. **Build**: Project must compile/bundle

```bash
# Validation pipeline
npm run lint || { echo "Lint failed"; git cherry-pick --abort; exit 1; }
npm test || { echo "Tests failed"; git cherry-pick --abort; exit 1; }
npm run build || { echo "Build failed"; git cherry-pick --abort; exit 1; }
```

## Escalation Protocol

When escalating conflicts to humans:

1. **Abort operation cleanly**
2. **Collect context information**:
   - Conflicted files
   - Commit SHAs involved
   - Branches involved
   - Conflict type classification
3. **Generate report**:

   ```
   CONFLICT ESCALATION REPORT
   
   Operation: Cherry-pick <sha>
   Branch: <current-branch>
   
   Conflicted Files:
   - src/payment.js (Complex logic conflict)
   - config/api.json (Configuration conflict)
   
   Recommendation: Manual review required
   Reasoning: Business logic affected
   ```

## Common Pitfall Avoidance

### ❌ Never Auto-Resolve

- Security-related code
- Authentication/authorization logic
- Payment processing
- Data validation rules
- API versioning changes

### ✅ Safe to Auto-Resolve

- README updates
- Comment additions
- Logging statements (non-critical)
- Pure formatting changes

## Example Workflows

### Example 1: Documentation Conflict

```bash
# Conflict in README.md
git status
# both modified: README.md

# Safe to auto-resolve
git checkout --theirs README.md
git add README.md
git cherry-pick --continue
```

### Example 2: Logic Conflict (Escalate)

```bash
# Conflict in auth.js
git status
# both modified: src/auth.js

# Check the conflict
git diff src/auth.js
# Both sides modified validateToken function

# ESCALATE
git cherry-pick --abort

# Report
cat > conflict-report.txt <<EOF
Conflict in src/auth.js requires manual review.
Both branches modified validateToken().
Security-critical code - human review mandatory.
EOF
```

### Example 3: Mixed Conflicts (Escalation)

```bash
# Multiple files conflicted
git status
# both modified: README.md
# both modified: src/core.js
# both modified: config.json

# Classify each file
# - README.md: Documentation (potentially safe)
# - src/core.js: Source code (requires review)
# - config.json: Configuration (critical - requires review)

# Decision: ANY critical file requires escalation
# ABORT without partial resolution
git cherry-pick --abort

# Report classification
echo "CONFLICT ESCALATION REPORT"
echo ""
echo "Conflicted Files:"
echo "- README.md: Documentation conflict"
echo "- src/core.js: Logic conflict (requires review)"
echo "- config.json: Configuration conflict (critical)"
echo ""
echo "Decision: Manual review required"
echo "Reasoning: Critical files (core.js, config.json) affected"
```

### Example 4: Rebase Conflict Resolution

```bash
# Rebase feature branch onto updated main
git checkout feature
git rebase main

# Conflict at step 2/4
# CONFLICT (content): Merge conflict in src/api.js

# Note: During rebase, --ours and --theirs are SWAPPED
# --ours = main (base branch)
# --theirs = feature (your commits being replayed)

# Resolve conflict
vim src/api.js
git add src/api.js

# Continue rebase
git rebase --continue

# If it all goes wrong
git rebase --abort
```

### Example 5: Empty Commit After Resolution

```bash
# After resolving conflicts, the changes already exist
git cherry-pick --continue
# The previous cherry-pick is now empty

# Option 1: Skip (most common)
git cherry-pick --skip

# Option 2: Keep empty commit for traceability
git commit --allow-empty -m "chore: empty cherry-pick from abc123 (already applied)"
```

---

## --ours vs --theirs Reference

The meaning of `--ours` and `--theirs` depends on the operation:

| Operation | --ours | --theirs |
|-----------|--------|----------|
| Merge | Current branch (HEAD) | Branch being merged in |
| Cherry-pick | Current branch (HEAD) | Commit being cherry-picked |
| Rebase | **Base branch** (e.g., main) | **Your commits** being replayed |

**⚠️ Rebase gotcha:** During rebase, your commits are replayed on top of the target branch, so they become "theirs".

---

**Related Skills:**

- `dev-git-cherry-pick` - Provides conflict states
- `dev-git-commit-author` - Post-resolution commits
- `dev-git-inspector` - Pre-operation state verification
