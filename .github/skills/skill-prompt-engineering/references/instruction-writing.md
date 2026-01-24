# Instruction Writing Guide

How to write effective instructions for AI agents and LLMs.

## Core Principles

### 1. Be Explicit and Direct

LLMs perform better with clear, unambiguous instructions.

**❌ Vague:**
```
Help me with this code.
```

**✅ Explicit:**
```
Review this TypeScript function for:
1. Type safety issues
2. Potential null/undefined errors
3. Performance optimizations

Provide specific fixes with code examples.
```

### 2. Provide Context and Motivation

Explain the "why" to improve relevance.

**❌ No context:**
```
Create a user validation function.
```

**✅ With context:**
```
We're building a registration form that needs to validate user input
before submission. Create a validation function that checks:
- Email format (must be valid email)
- Password strength (min 8 chars, 1 number, 1 special)
- Username availability (alphanumeric, 3-20 chars)

This runs client-side, so keep it lightweight.
```

### 3. Use Positive Framing

Tell the LLM what TO DO, not what NOT to do.

| ❌ Negative | ✅ Positive |
|------------|-------------|
| "Don't be verbose" | "Be concise, limit to 2-3 sentences" |
| "Don't use complex words" | "Use simple, everyday language" |
| "Don't skip steps" | "Complete all steps in the order given" |
| "Don't include opinions" | "Include only verified facts" |

### 4. Structure with Formatting

Use markdown for clarity:

```markdown
## Task
[One sentence describing the goal]

## Context
[Background information needed]

## Requirements
- Requirement 1
- Requirement 2
- Requirement 3

## Output Format
[Expected structure of response]

## Examples
[Input/output examples]
```

### 5. Include Examples

Examples are the most effective way to guide behavior.

**Format:**
```markdown
## Examples

### Example 1
**Input**: User asks "How do I reset my password?"
**Output**: 
1. Click "Forgot Password" on the login page
2. Enter your email address
3. Check your inbox for reset link
4. Click the link and create a new password

### Example 2
**Input**: User asks "Can I use multiple email addresses?"
**Output**:
Each account supports one primary email. You can add backup emails in Settings > Account > Email Addresses.
```

### 6. Specify Output Format

Be explicit about the expected response structure.

**Examples:**

```markdown
Respond with a JSON object:
{
  "valid": boolean,
  "errors": string[],
  "suggestions": string[]
}
```

```markdown
Format your response as:
1. Summary (1-2 sentences)
2. Key findings (bullet list)
3. Recommendations (numbered list)
4. Code example (if applicable)
```

### 7. Define Terminology

Don't assume the LLM knows your terms.

**❌ Assumes knowledge:**
```
Follow our standard PR process.
```

**✅ Defines terms:**
```
Follow our PR process:
1. Create feature branch from main
2. Make changes with conventional commits
3. Open PR with description template
4. Request review from team lead
5. Address feedback with new commits
6. Squash merge after approval
```

---

## Instruction Templates

### Task Execution Template

```markdown
## Goal
[What should be accomplished]

## Context
[Background information]

## Steps
1. [First step]
2. [Second step]
3. [Third step]

## Output
[What the result should look like]

## Constraints
- [Constraint 1]
- [Constraint 2]
```

### Review/Analysis Template

```markdown
## Subject
[What is being reviewed]

## Review Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Focus Areas
[Specific areas to pay attention to]

## Output Format
For each issue found:
- Location: [where]
- Issue: [what's wrong]
- Suggestion: [how to fix]
- Severity: [low/medium/high]
```

### Generation Template

```markdown
## Generate
[What to create]

## Style
- Tone: [formal/casual/technical]
- Length: [word count or scope]
- Format: [markdown/JSON/code]

## Requirements
- [Requirement 1]
- [Requirement 2]

## Examples
[Reference examples]

## Avoid
[Things to not include]
```

---

## Common Patterns

### Step-by-Step Instructions

```markdown
## How to complete this task

### Step 1: [Action verb] [Object]
[Detailed instructions]

**Example:**
[Concrete example]

### Step 2: [Action verb] [Object]
[Detailed instructions]

**Validation:**
[How to verify this step is complete]

### Step 3: [Action verb] [Object]
[Detailed instructions]

**Output:**
[What the result should look like]
```

### Conditional Instructions

```markdown
## Handling Different Cases

### If [condition A]:
1. [Step 1]
2. [Step 2]

### If [condition B]:
1. [Different step 1]
2. [Different step 2]

### Otherwise:
[Default behavior]
```

### Error Handling Instructions

```markdown
## Error Handling

### When [error type 1] occurs:
- **Cause**: [Why this happens]
- **Solution**: [How to fix]
- **Prevention**: [How to avoid]

### When [error type 2] occurs:
- **Cause**: [Why this happens]
- **Solution**: [How to fix]
- **Prevention**: [How to avoid]
```

---

## Quality Checklist

Before finalizing instructions:

- [ ] **Goal is clear** - Reader knows what to accomplish
- [ ] **Context provided** - Background explains the "why"
- [ ] **Steps are actionable** - Each step starts with a verb
- [ ] **Examples included** - At least one input/output example
- [ ] **Format specified** - Output structure is defined
- [ ] **Constraints listed** - Boundaries are explicit
- [ ] **Terms defined** - No assumed knowledge
- [ ] **Positive framing** - Tells what to do, not what to avoid

---

## Anti-Patterns

### Wall of Text
**Problem:** Dense paragraphs are hard to parse.
**Solution:** Use headings, lists, and whitespace.

### Implicit Assumptions
**Problem:** Assumes knowledge the reader doesn't have.
**Solution:** Define all terms and provide context.

### Missing Examples
**Problem:** Inconsistent interpretation.
**Solution:** Include 2-3 representative examples.

### Conflicting Instructions
**Problem:** "Be brief" but "include all details"
**Solution:** Prioritize requirements or be specific about scope.

### Order Ambiguity
**Problem:** Unclear which steps come first.
**Solution:** Number steps explicitly.
