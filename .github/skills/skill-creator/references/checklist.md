# Skill Validation Checklist

Use this checklist to validate skills before deployment.

## Quick Validation

Run the official validator:

```bash
skills-ref validate ./skill-name
```

## Manual Checklist

### Structure

- [ ] `SKILL.md` exists in skill directory
- [ ] Directory name matches `name` field in frontmatter
- [ ] Optional directories use correct names: `scripts/`, `references/`, `assets/`

### Frontmatter

#### Required Fields

- [ ] `name` field is present
- [ ] `name` is 1-64 characters
- [ ] `name` uses only lowercase letters, numbers, and hyphens
- [ ] `name` does not start with a hyphen
- [ ] `name` does not end with a hyphen
- [ ] `name` does not contain consecutive hyphens (`--`)
- [ ] `name` matches the parent directory name
- [ ] `description` field is present
- [ ] `description` is 1-1024 characters
- [ ] `description` describes what the skill does
- [ ] `description` describes when to use it
- [ ] `description` includes keywords for task matching

#### Optional Fields

- [ ] `license` is reasonable length (if present)
- [ ] `compatibility` is 1-500 characters (if present)
- [ ] `metadata` values are strings (if present)
- [ ] `allowed-tools` uses valid tool patterns (if present)

### Content Quality

#### Structure

- [ ] Body content follows clear structure
- [ ] Includes "What is it?" section
- [ ] Includes "Why use it?" section
- [ ] Includes "How to use it?" section
- [ ] Uses proper markdown formatting

#### Token Budget

- [ ] Body content is < 5000 tokens (recommended)
- [ ] Detailed content is in `references/` directory
- [ ] Large examples are in `assets/` directory

#### Clarity

- [ ] Instructions are step-by-step
- [ ] Examples are concrete and actionable
- [ ] Edge cases are documented
- [ ] Code examples are complete and runnable

### Scripts (if present)

- [ ] Scripts are executable (`chmod +x`)
- [ ] Scripts include shebang line (`#!/bin/bash` or `#!/usr/bin/env python3`)
- [ ] Scripts document their dependencies
- [ ] Scripts have helpful error messages
- [ ] Scripts handle edge cases gracefully
- [ ] Scripts are referenced correctly in SKILL.md

### References (if present)

- [ ] Files follow consistent naming (`UPPERCASE.md` for primary docs)
- [ ] Files are referenced correctly in SKILL.md using relative paths
- [ ] Content is well-organized and searchable
- [ ] No duplicate content with SKILL.md

### Assets (if present)

- [ ] Templates are complete and usable
- [ ] Schemas are valid (JSON Schema, YAML, etc.)
- [ ] Images are reasonably sized
- [ ] File formats are appropriate

### File References

- [ ] All referenced files exist
- [ ] Relative paths are correct
- [ ] No broken links in SKILL.md
- [ ] No orphaned files in directories

## Security Checklist

- [ ] No hardcoded secrets or credentials
- [ ] No destructive commands without confirmation prompts
- [ ] Scripts validate input before processing
- [ ] Error messages don't expose sensitive information
- [ ] `allowed-tools` is minimal and specific

## Best Practices Checklist

- [ ] Skill is focused on a single capability
- [ ] Name is descriptive and memorable
- [ ] Description enables accurate task matching
- [ ] Instructions are agent-friendly (not human-only)
- [ ] Examples show expected inputs and outputs
- [ ] Limitations are clearly documented
- [ ] Version is tracked in metadata

## Testing Checklist

- [ ] Skill activates for intended task descriptions
- [ ] Instructions lead to successful task completion
- [ ] Scripts execute without errors
- [ ] Edge cases are handled correctly
- [ ] Error conditions provide useful feedback

---

## Validation Results Template

```markdown
## Skill Validation Report

**Skill**: skill-name
**Date**: YYYY-MM-DD
**Validator**: [name]

### Summary

- [ ] **PASS** / [ ] **FAIL**

### Structure

| Check                  | Status | Notes |
| ---------------------- | ------ | ----- |
| SKILL.md exists        | ✅     |       |
| Directory name matches | ✅     |       |

### Frontmatter

| Check             | Status | Notes |
| ----------------- | ------ | ----- |
| name valid        | ✅     |       |
| description valid | ✅     |       |

### Content

| Check           | Status | Notes        |
| --------------- | ------ | ------------ |
| Token budget    | ✅     | ~2000 tokens |
| Clear structure | ✅     |              |

### Scripts

| Check          | Status | Notes |
| -------------- | ------ | ----- |
| Executable     | ✅     |       |
| Error handling | ✅     |       |

### Issues Found

1. Issue description
   - Location: file/section
   - Severity: Critical/Warning/Info
   - Recommendation: How to fix

### Recommendations

- Recommendation 1
- Recommendation 2
```

---

## Common Issues and Fixes

### Issue: Name doesn't match directory

**Symptom**: Validation fails on name check
**Fix**: Ensure `name` field exactly matches parent directory name

```yaml
# Directory: pdf-processing/SKILL.md
---
name: pdf-processing # Must match exactly
---
```

### Issue: Description too vague

**Symptom**: Skill not activated for intended tasks
**Fix**: Add specific keywords and use cases

```yaml
# ❌ Bad
description: Helps with data.

# ✅ Good
description: Processes CSV and JSON files for data analysis. Use when extracting, transforming, or loading data between formats.
```

### Issue: Token budget exceeded

**Symptom**: Large skill body slows activation
**Fix**: Move detailed content to `references/`

```markdown
# SKILL.md (brief)

See [detailed reference](references/REFERENCE.md) for complete API.
```

### Issue: Broken file references

**Symptom**: Agent can't find referenced files
**Fix**: Use correct relative paths from SKILL.md

```markdown
# ✅ Correct

See [reference](references/REFERENCE.md)

# ❌ Wrong (absolute or wrong directory)

See [reference](/path/to/REFERENCE.md)
```

### Issue: Scripts not executable

**Symptom**: Permission denied when running scripts
**Fix**: Add execute permissions

```bash
chmod +x scripts/main.py
```
