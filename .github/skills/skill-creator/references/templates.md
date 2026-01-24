# Skill Templates

Reusable templates for creating Agent Skills. Copy and modify for your use case.

## Minimal Template

The simplest valid skill with only required elements:

```markdown
---
name: my-skill
description: Brief description of what this skill does and when to use it.
---

# My Skill

Instructions for the agent to follow when using this skill.
```

## Standard Template

A well-structured skill with all recommended sections:

```markdown
---
name: my-skill
description: Comprehensive description covering what the skill does, when to use it, and keywords for task matching.
license: Apache-2.0
metadata:
  author: your-name
  version: "1.0"
---

# My Skill

## What is it?

Brief explanation of the skill's purpose and capabilities.

## Why use it?

- Benefit one
- Benefit two
- Benefit three

## How to use it?

1. First step with clear instructions
2. Second step with examples
3. Third step with validation

### Example

\`\`\`typescript
// Example code demonstrating usage
const result = myFunction();
console.log(result);
\`\`\`

## Key Operations

| Operation     | Description  | Example   |
| ------------- | ------------ | --------- |
| `operation-1` | What it does | `example` |
| `operation-2` | What it does | `example` |

## Common Patterns

### Pattern 1: Simple Case

Instructions for the simple case.

### Pattern 2: Complex Case

Instructions for the complex case with edge cases.

## Limitations

- Limitation one
- Limitation two

## Supporting References

- [reference.md](references/reference.md) - Detailed reference guide
```

## Full Template with All Directories

Complete skill with scripts, references, and assets:

```plaintext
my-skill/
├── SKILL.md
├── scripts/
│   ├── main.ts
│   └── helper.sh
├── references/
│   ├── REFERENCE.md
│   └── EXAMPLES.md
└── assets/
    ├── template.json
    └── schema.yaml
```

### SKILL.md

```markdown
---
name: my-skill
description: Full-featured skill with scripts, references, and assets. Use when you need comprehensive workflow automation.
license: Apache-2.0
compatibility: Requires Node.js 18+, jq
metadata:
  author: your-name
  version: "1.0"
  category: automation
allowed-tools: Bash(npx:*) Bash(jq:*) Read
---

# My Skill

## What is it?

A comprehensive skill that provides automated workflows.

## Why use it?

- Automates repetitive tasks
- Ensures consistency
- Reduces errors

## How to use it?

### Step 1: Prepare input

Ensure you have the required data in the expected format.

### Step 2: Run the main script

\`\`\`bash
npx tsx scripts/main.ts --input data.json --output result.json
\`\`\`

### Step 3: Validate output

Check the result against the [schema](assets/schema.yaml).

## Scripts

| Script                         | Purpose                    |
| ------------------------------ | -------------------------- |
| [main.ts](scripts/main.ts)     | Primary workflow execution |
| [helper.sh](scripts/helper.sh) | Utility functions          |

## Supporting References

- [REFERENCE.md](references/REFERENCE.md) - Complete API reference
- [EXAMPLES.md](references/EXAMPLES.md) - Extended examples

## Limitations

- Requires Node.js 18+
- Network access needed for external APIs
```

---

## Domain-Specific Templates

### Development Skill Template

```markdown
---
name: code-review
description: Performs code review following team standards. Use when reviewing PRs, checking code quality, or enforcing style guidelines.
license: Apache-2.0
compatibility: Requires git, eslint, prettier
metadata:
  author: dev-team
  version: "1.0"
  category: development
---

# Code Review Skill

## What is it?

Automated code review following established team standards and best practices.

## Why use it?

- Consistent code quality across the team
- Catches common issues before merge
- Enforces style guidelines automatically

## How to use it?

1. Run linting: `npm run lint`
2. Check formatting: `npm run format:check`
3. Run tests: `npm run test`
4. Review security: Check for hardcoded secrets, SQL injection, XSS

## Review Checklist

### Code Quality

- [ ] Functions are small and focused
- [ ] No code duplication
- [ ] Proper error handling
- [ ] Edge cases covered

### Security

- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Output encoding for user data

### Testing

- [ ] Unit tests for new code
- [ ] Integration tests for APIs
- [ ] Edge cases tested

## Supporting References

- [standards.md](references/standards.md) - Coding standards
- [security.md](references/security.md) - Security guidelines
```

### Documentation Skill Template

```markdown
---
name: documentation
description: Creates and maintains documentation following best practices. Use when writing READMEs, API docs, guides, or technical specifications.
license: Apache-2.0
metadata:
  author: docs-team
  version: "1.0"
  category: documentation
---

# Documentation Skill

## What is it?

Guides for creating clear, consistent documentation.

## Why use it?

- Consistent structure across all docs
- Improves discoverability and SEO
- Better developer experience

## How to use it?

### All Documentation Must Include

1. **Title**: Clear, descriptive title
2. **Description**: One-line summary
3. **What is it?**: Purpose explanation
4. **Why use it?**: Benefits and use cases
5. **How to use it?**: Step-by-step instructions

### Formatting Rules

- Use code blocks with language tags
- Use tables for structured data
- Use callouts for important notes
- Include working examples

### Example Structure

\`\`\`markdown

# Feature Name

Brief description.

## What is it?

Explanation.

## Quick Start

\\\`\\\`\\\`typescript
// Working example
\\\`\\\`\\\`

## API Reference

| Method  | Description |
| ------- | ----------- |
| `foo()` | Does X      |

\`\`\`
```

### Data Processing Skill Template

```markdown
---
name: data-processing
description: Processes and transforms data files. Use when extracting, transforming, or loading data between formats (CSV, JSON, XML, etc.).
license: Apache-2.0
compatibility: Requires Node.js 18+, jq
metadata:
  author: data-team
  version: "1.0"
  category: data
---

# Data Processing Skill

## What is it?

Tools and workflows for data extraction, transformation, and loading.

## Why use it?

- Standardized data pipelines
- Validated transformations
- Reproducible results

## How to use it?

### CSV to JSON

\`\`\`bash
npx tsx scripts/convert.ts --input data.csv --output data.json
\`\`\`

### JSON to CSV

\`\`\`bash
npx tsx scripts/convert.ts --input data.json --output data.csv
\`\`\`

### Data Validation

\`\`\`bash
npx tsx scripts/validate.ts --input data.json --schema assets/schema.json
\`\`\`

## Common Transformations

| From | To   | Script                   |
| ---- | ---- | ------------------------ |
| CSV  | JSON | `scripts/csv-to-json.ts` |
| JSON | CSV  | `scripts/json-to-csv.ts` |
| XML  | JSON | `scripts/xml-to-json.ts` |

## Supporting References

- [schemas/](assets/schemas/) - Data schemas
- [examples/](assets/examples/) - Example files
```

---

## Tips for Customization

1. **Replace placeholders**: Change `my-skill`, `your-name`, etc.
2. **Adjust sections**: Add or remove sections based on needs
3. **Update metadata**: Set appropriate author, version, category
4. **Add references**: Create supporting files for complex skills
5. **Include examples**: Real examples improve agent performance
