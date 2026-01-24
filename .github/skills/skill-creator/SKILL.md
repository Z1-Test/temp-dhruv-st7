---
name: skill-creator
description: Create new Agent Skills following the open agentskills.io specification. Use when building skills for Claude Code, OpenAI Codex, or other skills-compatible AI agents. Guides through an interactive questionnaire before generating skill files.
license: Apache-2.0
compatibility: Designed for Claude Code, OpenAI Codex, and any Agent Skills compatible product
metadata:
  author: staytuned
  version: "2.0"
  category: development
---

# Skill Creator

## What is it?

An interactive skill that guides you through creating new Agent Skills by asking questions to understand your requirements, then generating compliant skill files following the [open Agent Skills specification](https://agentskills.io).

## Why use it?

- **Interactive workflow**: Gathers requirements through questions before generating files
- **Interoperability**: Creates skills compatible with Claude Code, OpenAI Codex, and other agents
- **Specification compliance**: Ensures correct frontmatter, structure, and validation
- **Best practices**: Embeds naming conventions, token budgets, and security considerations

---

## How to use it?

> [!IMPORTANT]
> Before creating any files, you MUST ask the user the following questions and wait for their responses.

### Phase 1: Requirements Gathering (REQUIRED)

Ask the user these questions in order. Wait for responses before proceeding.

#### Question 1: Purpose & Capability

```
What capability or expertise should this skill provide?

Examples:
- "Code review following team standards"
- "Generate API documentation from TypeScript"
- "Create data visualizations from CSV files"

Your answer:
```

#### Question 2: Trigger Context

```
When should an agent activate this skill? What keywords or task descriptions should trigger it?

Examples:
- "When reviewing PRs or checking code quality"
- "When user asks for docs, documentation, or API reference"
- "When working with data files, charts, or visualizations"

Your answer:
```

#### Question 3: Domain & Location

```
What domain does this skill belong to, and where should it be saved?

Domains: development, finance, hr, marketing, or custom
Location example: domains/development/skills/your-skill-name

Your answer:
```

#### Question 4: Skill Name

```
What should the skill be named? (lowercase, hyphens allowed, 1-64 chars)

Examples: code-review, api-docs, data-viz

Your answer:
```

#### Question 5: Complexity Level

```
What complexity level does this skill need?

1. **Minimal**: Just SKILL.md with instructions
2. **Standard**: SKILL.md + references/ for detailed docs
3. **Full**: SKILL.md + scripts/ + references/ + assets/

Your answer (1, 2, or 3):
```

#### Question 6: Scripts (if complexity is Full)

```
If you selected Full, what scripts should be included?

Examples:
- "TypeScript script to validate schemas"
- "Shell script to run linting"
- "No scripts needed"

Your answer:
```

#### Question 7: Author & License

```
Who is the author and what license should be used?

Author (default: staytuned):
License (default: Apache-2.0):
```

---

### Phase 2: Generate Skill Files

After gathering all responses, generate the skill files:

#### Step 1: Create directory structure

Based on complexity level:

**Minimal:**

```plaintext
skill-name/
└── SKILL.md
```

**Standard:**

```plaintext
skill-name/
├── SKILL.md
└── references/
    └── REFERENCE.md
```

**Full:**

```plaintext
skill-name/
├── SKILL.md
├── scripts/
│   └── main.ts
├── references/
│   └── REFERENCE.md
└── assets/
    └── template.json
```

#### Step 2: Generate SKILL.md frontmatter

Use collected information to create compliant frontmatter:

```yaml
---
name: [skill-name from Q4]
description: [Combine Q1 purpose + Q2 triggers into 50-200 char description]
license: [from Q7, default Apache-2.0]
compatibility: Designed for Claude Code and compatible agents
metadata:
  author: [from Q7]
  version: "1.0"
  category: [domain from Q3]
---
```

#### Step 3: Generate SKILL.md body

Use this structure:

```markdown
# [Skill Title]

## What is it?

[Expand on Q1 purpose - 2-3 sentences]

## Why use it?

- [Benefit 1 based on capability]
- [Benefit 2 based on capability]
- [Benefit 3 based on capability]

## How to use it?

[Step-by-step instructions based on the capability]

### Step 1: [First action]

[Instructions]

### Step 2: [Second action]

[Instructions]

## Examples

[Concrete example with code blocks if applicable]

## Supporting References

- [Link to references/ if applicable]

## Limitations

- [Known limitations]
```

#### Step 4: Generate supporting files (if applicable)

For **Standard** and **Full** complexity:

- Create `references/REFERENCE.md` with detailed documentation

For **Full** complexity:

- Create `scripts/main.ts` with the requested script functionality
- Create `assets/` files as needed

---

### Phase 3: Validation

After generating files, verify:

- [ ] `SKILL.md` exists in skill directory
- [ ] `name` matches directory name exactly
- [ ] `name` is lowercase, 1-64 chars, no consecutive hyphens
- [ ] `description` is 50-200 characters with trigger keywords
- [ ] Body content is < 5000 tokens
- [ ] File references use relative paths
- [ ] Scripts (if any) include shebang and error handling

---

## Name Validation Rules

| Rule                       | Valid                 | Invalid          |
| -------------------------- | --------------------- | ---------------- |
| Lowercase only             | `pdf-processing`      | `PDF-Processing` |
| 1-64 characters            | `my-skill`            | (empty)          |
| No leading/trailing hyphen | `data-analysis`       | `-pdf`, `pdf-`   |
| No consecutive hyphens     | `code-review`         | `code--review`   |
| Must match directory       | `skill-name/SKILL.md` | Different names  |

## Progressive Disclosure

| Level        | Content                        | Token Budget | When Loaded |
| ------------ | ------------------------------ | ------------ | ----------- |
| Metadata     | name + description             | ~100 tokens  | Startup     |
| Instructions | Full SKILL.md body             | <5000 tokens | Activation  |
| Resources    | scripts/, references/, assets/ | As needed    | Execution   |

## Security Considerations

When skills include scripts:

- **Sandboxing**: Consider isolation for untrusted environments
- **Confirmation**: Important operations should require user confirmation
- **Logging**: Record script executions for audit trails

## Supporting References

- [specification.md](references/specification.md) - Full Agent Skills specification
- [templates.md](references/templates.md) - Reusable skill templates
- [hooks-integration.md](references/hooks-integration.md) - Claude Code hooks guide
- [checklist.md](references/checklist.md) - Validation checklist
