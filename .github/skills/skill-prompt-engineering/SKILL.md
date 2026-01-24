---
name: skill-prompt-engineering
description: Write high-quality prompts and effective instructions for AI agents and LLMs. Triggers when instructed like write instructions, create prompt, improve prompt, review instructions, prompt engineering, trigger words, enhance prompt, optimize instructions, instruction quality. Focuses on prompt quality, not skill structure.
metadata:
  category: meta
---

# AI Instructions & Prompt Engineering

## What is it?

A skill focused on **how to write effective prompts and instructions** that get the best results from AI agents and LLMs. This covers the *content quality* of instructions, not the structure or format of skills.

> **Note**: For creating skill files, directories, and frontmatter, use the [skill-creator](../skill-creator/SKILL.md) skill. This skill focuses on **what to write**, not **how to structure it**.

## Why use it?

- **Craft clear prompts**: Write instructions that LLMs understand precisely
- **Use trigger patterns**: Apply proven phrases that improve AI output
- **Positive framing**: Tell AI what TO DO for better results
- **Reduce errors**: Minimize hallucinations and ambiguity
- **Review quality**: Evaluate and improve existing instructions

---

## Skill Creator vs AI Instructions

| Skill Creator | AI Instructions |
|---------------|-----------------|
| How to structure a skill | How to write effective prompts |
| Frontmatter and metadata | Trigger words and patterns |
| Directory organization | Positive vs negative framing |
| File naming conventions | Clarity and precision |
| Template generation | Instruction quality review |

---

## How to use it?

### When Writing Instructions

1. **Clarity** - Define the goal and provide context for the task.
2. **Examples** - Include practical input/output examples to show expected results.
3. **Action-orientation** - Use positive framing and performance-enhancing trigger patterns.
4. **Specificity** - Define clear constraints, limits, and boundaries.

### When Reviewing Instructions

1. **Check clarity** - Is the instruction explicit and direct?
2. **Verify framing** - Positive (do) vs negative (don't)?
3. **Evaluate triggers** - Are performance-enhancing patterns used?
4. **Assess examples** - Are practical examples included?
5. **Review constraints** - Are limits clearly stated?

---

## Core Principles

### 1. Be Explicit and Direct

Vague instructions produce inconsistent results. Be specific:

**❌ Vague:**
```
Help me with this code.
```

**✅ Explicit:**
```
Review this TypeScript function for type safety issues
and potential null/undefined errors. Provide specific fixes.
```

### 2. Provide Context and Motivation

Explain the "why" to improve relevance:

```markdown
## Context
We're building a registration form that validates input client-side.
Keep validation lightweight for fast user feedback.

## Goal
Create a validation function that provides immediate, specific errors.
```

### 3. Use Positive Framing

Tell the AI what TO DO. Negative framing confuses LLMs:

| ❌ Negative | ✅ Positive |
|------------|-------------|
| "Don't be verbose" | "Be concise, limit to 2-3 sentences" |
| "Don't skip steps" | "Complete all steps in order" |
| "Don't make assumptions" | "Ask clarifying questions when uncertain" |
| "Avoid complex words" | "Use simple, everyday language" |

### 4. Place Constraints After Task

Put the main task first, then add constraints:

```markdown
## Task
Generate API documentation for the User model.

## Constraints
- Maximum 500 words
- Include code examples
- Markdown format only
```

---

## Trigger Patterns

### For Better Reasoning

| Pattern | When to Use |
|---------|-------------|
| "Think step by step" | Complex multi-step problems |
| "Show your reasoning" | Debugging or verification |
| "Before answering, consider..." | Ambiguous questions |
| "Break this down into parts" | Large tasks |

### For Accuracy

| Pattern | Purpose |
|---------|---------|
| "If unsure, say 'I don't know'" | Reduces hallucination |
| "Based on the provided context..." | Grounds response to input |
| "Double-check your answer" | Promotes self-verification |
| "Only include confident information" | Encourages accuracy |

### For Scope Control

| Pattern | Purpose |
|---------|---------|
| "Your task is..." | Clear scope definition |
| "Implement ONLY what is requested" | Prevents scope creep |
| "Choose the simplest interpretation" | Reduces over-engineering |

---

## Examples Best Practices

Always include input/output examples:

```markdown
## Examples

**Input**: User asks "How do I reset my password?"
**Output**: 
1. Click "Forgot Password" on the login page
2. Enter your email address
3. Check inbox for reset link
4. Click link and create new password

**Input**: Validate email format
**Output**:
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

---

## Handling Ambiguity

Build in ambiguity handling:

```markdown
## When Uncertain

If the request is ambiguous:
1. Ask 1-3 precise clarifying questions, OR
2. Present interpretations with labeled assumptions

When unsure about facts:
- Say "Based on the provided context..." 
- Say "I don't know" rather than guessing
```

---

## Anti-Patterns: Problem → Fix

| Problem | Fix |
|---------|-----|
| Vague: "Handle errors appropriately" | Explicit: "Log with stack trace, return user message, include error code" |
| Negative: "Don't include unnecessary details" | Positive: "Include only: core functionality, key parameters, one example" |
| No examples: "Create a validation function" | With example: Show input/output code pairs |
| Ambiguous order: "Run tests, install, build" | Numbered: "1. Install 2. Test 3. Build" |
| Wall of text without structure | Use headings, lists, and code blocks |
| Buried constraints at the end | Place constraints prominently after main task |

---

## Quick Validation Checklist

### Clarity
- [ ] Goal is explicitly stated
- [ ] Instructions are direct and unambiguous
- [ ] Technical terms are defined
- [ ] No implicit assumptions

### Framing
- [ ] Uses positive framing (what TO DO)
- [ ] Context/motivation provided
- [ ] Main task before constraints

### Trigger Patterns
- [ ] Appropriate trigger words used where helpful
- [ ] Reasoning guidance for complex tasks
- [ ] Accuracy safeguards included

### Examples
- [ ] At least one practical example included
- [ ] Input/output pairs shown
- [ ] Examples match actual use cases

### Constraints
- [ ] Constraints clearly stated
- [ ] Placed after main task (not buried)
- [ ] Limits are specific (not vague)

---

## Quality Scoring (1-5 Scale)

| Dimension | 1 (Poor) | 5 (Excellent) |
|-----------|----------|---------------|
| **Clarity** | Vague, ambiguous | Explicit, unambiguous, complete |
| **Structure** | Wall of text | Well-organized with clear hierarchy |
| **Actionability** | No clear steps | Step-by-step with validation |
| **Examples** | None | Comprehensive with edge cases |

### Scoring Summary

| Total | Rating | Action |
|-------|--------|--------|
| 17-20 | Excellent | Ready to use |
| 13-16 | Good | Minor improvements |
| 9-12 | Needs Work | Significant revision |
| 1-8 | Poor | Major rewrite |

---

## Limitations

- Focuses on **content quality only** - for skill structure use [skill-creator](../skill-creator/SKILL.md)
- Patterns are guidelines, not rigid rules - adapt to context
- Effectiveness varies by LLM model and version
- Cannot guarantee AI behavior, only improve likelihood of desired output

---

## Supporting References

- [prompt-engineering.md](references/prompt-engineering.md) - Trigger patterns and templates
- [instruction-writing.md](references/instruction-writing.md) - Writing techniques
