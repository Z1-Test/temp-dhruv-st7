# Prompt Engineering Reference

Unified guide to effective prompting using Markdown-based instructions.

## Core Principles

These patterns work across all major LLMs (GPT, Claude, Gemini) and are optimized for Markdown-based prompts.

### 1. Be Explicit and Direct

Clear, unambiguous instructions get better results.

```markdown
## Task
Validate the user input and return structured errors.

## Requirements
- Check email format
- Verify password has 8+ chars, 1 number, 1 special char
- Return JSON with field-specific errors
```

### 2. Provide Context and Motivation

Explain the "why" to improve relevance.

```markdown
## Context
We're building a registration form that validates input before submission.
This runs client-side, so keep validation lightweight.

## Goal
Create a validation function that provides immediate feedback.
```

### 3. Use Positive Framing

Tell the LLM what TO DO, not what NOT to do.

| ❌ Negative | ✅ Positive |
|------------|-------------|
| "Don't be verbose" | "Be concise, limit to 2-3 sentences" |
| "Don't skip steps" | "Complete all steps in order" |
| "Don't use complex words" | "Use simple, everyday language" |
| "Don't make assumptions" | "Ask clarifying questions when needed" |

### 4. Structure with Markdown

Use headings, lists, and formatting for clarity.

```markdown
## Task
[One sentence describing the goal]

## Context
[Background information]

## Requirements
- Requirement 1
- Requirement 2

## Output Format
[Expected structure]

## Examples
[Input/output pairs]

## Constraints
[Limitations and restrictions]
```

### 5. Place Constraints Appropriately

Put important constraints where they'll be followed:

```markdown
## Context
[Background information]

## Task
[Main instructions]

## Constraints  ← Place constraints after main task
- Maximum 3 paragraphs
- Use simple language
- Include exactly 2 examples
```

---

## Trigger Words & Patterns

### For Better Reasoning

| Pattern | Usage |
|---------|-------|
| "Think step by step" | Complex multi-step problems |
| "Take a deep breath and work through this carefully" | High-stakes tasks |
| "Show your reasoning for each step" | Debugging, verification |
| "Before answering, consider..." | Ambiguous questions |
| "Break this down into parts" | Multi-step tasks |

### For High-Quality Output

| Pattern | Effect |
|---------|--------|
| "Be thorough and complete" | Prevents shortcuts |
| "Double-check your answer" | Promotes self-verification |
| "This is important" | Encourages careful checking |

### For Accuracy

| Pattern | Purpose |
|---------|---------|
| "If unsure, say 'I don't know'" | Reduces hallucination |
| "Only include information you're confident about" | Encourages accuracy |
| "Based on the provided context..." | Grounds response |
| "Cite your sources" | Promotes attribution |

### For Scope Control

| Pattern | Purpose |
|---------|---------|
| "Your task is..." | Clear scope definition |
| "Implement ONLY what is requested" | Prevents scope creep |
| "Choose the simplest valid interpretation" | Reduces over-engineering |

---

## Instruction Templates

### Standard Task Template

```markdown
## Goal
[What should be accomplished]

## Context
[Background information and motivation]

## Steps
1. [First step with clear action verb]
2. [Second step]
3. [Third step]

## Output Format
[Expected structure of the response]

## Constraints
- [Constraint 1]
- [Constraint 2]
```

### Skill/Instruction Template

```markdown
# [Skill Title]

## What is it?
[1-2 sentences explaining purpose]

## Why use it?
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

## How to use it?

### Step 1: [Action]
[Clear instructions]

### Step 2: [Action]
[Clear instructions]

## Examples
[Practical examples with inputs/outputs]

## Limitations
[Known constraints]
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
- **Location**: [where]
- **Issue**: [what's wrong]
- **Suggestion**: [how to fix]
- **Severity**: [low/medium/high]
```

---

## Handling Ambiguity

When instructions might be unclear, add explicit guidance:

```markdown
## Handling Ambiguity

If the request is ambiguous or underspecified:
1. Ask 1-3 precise clarifying questions, OR
2. Present 2-3 plausible interpretations with labeled assumptions

When uncertain about facts:
- State "Based on the provided context..." instead of absolute claims
- Say "I don't know" rather than fabricating information
```

---

## Long-Context Best Practices

For large documents or extensive context:

```markdown
## Long-Context Handling

For inputs with extensive context:
1. First, identify key sections relevant to the request
2. Re-state the user's constraints before answering
3. Anchor claims to specific sections ("In the 'Setup' section...")
4. Quote or paraphrase fine details (dates, numbers, thresholds)

Based on the entire document above, provide a comprehensive answer
synthesizing all relevant information.
```

---

## Output Control

### Verbosity Control

```markdown
## Output Guidelines

- Default: 3-6 sentences or ≤5 bullets
- Simple questions: ≤2 sentences
- Complex tasks: 1 overview paragraph + tagged bullets
  - What changed
  - Where
  - Next steps

Keep responses concise and task-focused.
Avoid long narrative paragraphs; prefer compact bullets.
```

### Format Specification

```markdown
## Output Format

Respond with:
1. A brief summary (2-3 sentences)
2. Code block with the solution
3. Bullet list of key considerations

Use markdown formatting:
- Headings for sections
- Code blocks with language tags
- Tables for structured data
```

---

## Examples Best Practices

Include practical examples with input/output pairs:

```markdown
## Examples

### Example 1
**Input**: Create a greeting component
**Output**: 
export function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

### Example 2
**Input**: Validate email format
**Output**:
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

---

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Better Approach |
|--------------|---------|-----------------|
| Vague instructions | Ambiguous output | Be explicit and specific |
| Negative framing | Confusion | Use positive framing |
| No examples | Inconsistent results | Include 2-3 examples |
| Wall of text | Missed details | Use structure and formatting |
| Over-constraining | Limited creativity | Balance constraints |
| Buried constraints | Ignored limits | Place constraints prominently |
| Implicit assumptions | Misunderstanding | Define all terms |

---

## Quick Reference

### Must-Have Elements

- [ ] Clear goal statement
- [ ] Context/motivation
- [ ] Actionable steps
- [ ] Output format specification
- [ ] At least one example
- [ ] Explicit constraints

### Quality Checks

- [ ] Uses positive framing?
- [ ] Steps start with action verbs?
- [ ] Examples match use cases?
- [ ] Constraints are explicit?
- [ ] Structure uses markdown well?

---

## Sources

- [OpenAI GPT Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)
- [Anthropic Claude Prompting Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [Google Gemini Prompting Guide](https://ai.google.dev/docs/prompt_best_practices)
