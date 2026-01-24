---
name: dev-git-commit-author
description: Author clean, atomic commits with conventional formatting and selective staging. Use when creating commits, generating messages, staging changes, or amending recent commits.
metadata:
  category: development
---

# Git Commit Author

## What is it?

A skill that helps create well-structured, atomic commits with conventional commit messages. It guides selective staging, proper scoping, and message formatting to make AI-generated commits legible and auditable.

## Why use it?

- **Atomic commits**: Create focused commits that represent single logical changes.
- **Conventional formatting**: Enforce standardized commit message structure for better tooling and readability.
- **Selective staging**: Stage only relevant changes for clean commit history.
- **Non-interactive safety**: Ensures commands do not hang the agent by opening text editors (Vim/Nano).

## How to use it?

### Step 1: Analyze and Stage Selectively

Never blindly stage all files. Analyze the status first.

**Option A: Use the review script (Recommended)**
```bash
bash instructions/skills/dev-git-commit-author/scripts/review-changes.sh
```

This displays staged/unstaged changes with commit message suggestions.

**Option B: Manual review**
1.  **Check Status:** `git status`
2.  **View Diffs:** `git diff <filename>` (to understand context for the message)
3.  **Stage Files:** `git add <specific_file_path>`

> **Warning:** Avoid `git add .` unless explicitly instructed to stage "all changes including untracked files".

**Interactive staging (`git add -p`):**
See [Git Interactive Staging Documentation](https://git-scm.com/book/en/v2/Git-Tools-Interactive-Staging) for details on staging hunks (`y`, `n`, `s`, `e`, etc.).

### Step 2: Create a commit with conventional message

Write a commit following conventional commit format.

```bash
git commit -m "<type>(scope): <description>"
```

**Conventional Commit Format:**

```
<type>(scope): <description>

[body]

[footer(s)]
```

**Common types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files

**Example:**

```bash
# Use multiple -m flags for title and body (Non-interactive)
git commit -m "feat(auth): add JWT token validation" -m "Implements token expiry checks and signature verification to enhance security for API endpoints."
```

### Step 3: Execute Non-Interactive Commit

Use multiple `-m` flags to create headers and bodies without opening an editor.

```bash
git commit -m "<type>(<scope>): <subject>" -m "<detailed body paragraph>"
```

### Step 4: Amend recent commit (if needed)

Modify the most recent commit without creating a new one.

```bash
git commit --amend --no-edit  # Keep same message
git commit --amend            # Edit message
```

**Use cases:**

- Add forgotten files to last commit
- Fix typos in commit message
- Adjust changes in last commit

### Step 4: Create signed commits (optional)

Sign commits with GPG for verification.

```bash
git commit -S -m "feat(auth): add secure login"
```

**Prerequisites:**

- GPG key configured: `git config --global user.signingkey <key-id>`
- For automatic signing: `git config --global commit.gpgsign true`

## Commit Message Validation

Git accepts any commit message format. To enforce conventional commits, use validation tools:

### Using commitlint (recommended)

```bash
# Install
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Create commitlint.config.js
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js

# Use with husky for git hooks
npm install --save-dev husky
npx husky install
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

### Validation rules enforced

- Type must be one of: feat, fix, docs, refactor, test, chore, perf, style, ci
- Subject must not be empty
- Subject must not end with period
- Header must be ≤ 100 characters

## Examples

### Scenario: Creating an atomic feature commit

```bash
# 1. Review current changes
bash instructions/skills/dev-git-commit-author/scripts/review-changes.sh -q

# 2. Stage only authentication-related files
git add src/auth/login.js src/auth/token.js tests/auth.test.js

# 3. Commit using flags (Non-interactive)
git commit -m "feat(auth): implement JWT authentication" -m "Implements token expiry checks and signature verification to enhance security for API endpoints."
```

### Scenario: Fixing a bug with proper message

```bash
# Stage the fix
git add src/utils/validation.js

# Commit with conventional format (Non-interactive)
git commit -m "fix(validation): prevent null reference in email validator" -m "Adds null check before accessing email string methods."
```

### Scenario: Amending to add forgotten file

**Constraint:** Only amend if the commit has **not** been pushed.

```bash
# 1. Add the forgotten file
git add forgotten-file.js

# 2. Amend without opening editor
git commit --amend --no-edit
```

# Limitations & Rules

1.  **No Interactive Commands:** Never run `git commit` without arguments. It opens an editor and hangs the process.
2.  **No Blind Staging:** Do not use `git add .` unless the user specifically requests "stage everything".
3.  **Pushed Commits:** Never amend a commit that has already been pushed to a remote branch.

## Supporting Scripts

- **review-changes.sh**: Helper script to analyze staged/unstaged changes with commit suggestions
  - Usage: `bash instructions/skills/dev-git-commit-author/scripts/review-changes.sh`
  - Quiet mode: `bash instructions/skills/dev-git-commit-author/scripts/review-changes.sh -q`

## Supporting References

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Git Commit Documentation](https://git-scm.com/docs/git-commit)
- Related skills: `dev-git-stash`, `dev-git-cherry-pick`
