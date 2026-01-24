---
title: Markdown & MDX documentation skill
description: Rules and conventions for writing MDX/Markdown documentation for technical projects and general content.
tags:
  - markdown
  - mdx
  - docs
  - editorial
name: markdown
---

# Markdown & MDX documentation skill

A general-purpose skill for writing consistent, machine-readable Markdown and MDX documentation across technical projects, policies, guides, and more.

## What is it?

This skill provides MDX/Markdown conventions for documentation: structure, style, formatting, and content sections. It helps keep docs consistent, machine-indexable, and useful for humans and RAG systems across different use cases.

## Why use it?

- Keeps documentation consistent and searchable.
- Ensures content follows the "What/Why/How" pattern for clarity.
- Improves indexing and discoverability by using frontmatter and tags where it matters most.

## How to use it

1. Add a YAML frontmatter with `title`, `description`, and `tags` to all markdown files for consistency, indexing, and discoverability.
2. Structure pages with clear headings and prefer the "What is it? / Why use it? / How to use it?" pattern.
3. Use fenced code blocks with language tags for all code examples (e.g., `ts`, `bash`).
4. Use GitHub-style callouts for emphasis (e.g., `> [!NOTE]`).
5. Include sections: `Scalability & Performance`, `Security & Best Practices`, and `Limitations & Trade-offs` when the content is a feature or public API.

## Doc scope & tiers

All markdown files should include frontmatter for consistency and machine readability. Use MDX only when you need interactive components or advanced features.

| Doc type | Frontmatter | MDX | Use cases |
| --- | --- | --- | --- |
| Features/APIs | Required | Optional | SDK docs, library references, public API surfaces, developer-facing features |
| Technical guides | Required | Optional | How-tos, integration guides, onboarding for engineers, tutorials |
| Policies/SOPs | Required | Not required | HR policies, procedures, compliance docs, internal processes |
| Handbooks | Required | Not required | Team handbooks, FAQs, reference material, knowledge bases |
| Marketing/Sales | Required | Not required | Case studies, product briefs, event materials, landing page copy |

When to use each tier:

- Use frontmatter in all documents to enable consistent indexing, routing, and discoverability by agents and search systems.
- Tags should reflect the document's purpose, audience, and primary keywords for better content discovery.
- Frontmatter enables automated workflows such as content classification, version tracking, and knowledge graph construction.

Notes:

- Use MDX only when you need interactive components or advanced features. Plain Markdown with frontmatter is the standard for all docs.
- Frontmatter enables routing, indexing, and retrieval for agents, making it essential for all documentation across the organization.

## Style & Visuals

> [!WARNING]
> Bold emphasis (double asterisks) must not be used in documentation files.

- Use headings (`#`, `##`, `###`) for hierarchy; avoid vague headings like "Introduction" or "Conclusion"—be specific (e.g., "What is it?", "How to use it?").
- Lists: use ordered (`1.`) or unordered (`-`) for any itemized content.
- Code blocks: always use fenced blocks with an appropriate language tag.
- Diagrams: use Mermaid for complex flows or architecture diagrams.
- Media: include high-quality screenshots or videos for UI features; prefer progressive loading for large media.

## Content & Structure requirements

- Every markdown file must include frontmatter with `title`, `description`, and `tags` to support indexing and content discovery.
- Every feature or top-level guide must include the three core sections: What / Why / How.
- Link related content using relative links for better knowledge graph construction.
- Include a `Scalability & Performance` section and a `Security & Best Practices` section for features and APIs.
- Explicitly list `Limitations & Trade-offs` (latency, concurrency, complexity) for any feature.

> [!NOTE]
> Use the "What / Why / How" structure for short pages and expand with examples and callouts for longer guides.
> [!NOTE]
> If the document describes a feature or public API, include Scalability, Security, and Limitations sections. If it does not, those sections are optional.

## Technical accuracy & examples

- When including code examples, use fenced blocks with proper language tags and mark status (Stable/Experimental/Deprecated) where applicable.
- Use explicit types in typed languages (TypeScript, Python type hints, etc.) for clarity.

Example feature/API frontmatter and snippet (Tier 1):

````plaintext
---
title: feature-x
description: "Short one-line description of Feature X"
tags: [feature, api]
---

## What is it?

Short explanation.

## Quick start

```ts
// TypeScript example with explicit types
const greet = (name: string): string => `hello ${name}`;
```

````

Example technical guide frontmatter (Tier 1):

````plaintext
---
title: getting-started
description: "Set up and run the project locally"
tags: [guide, onboarding]
---

## What is it?

Short explanation.

## Why use it?

Short explanation.

## How to use it?

Step-by-step instructions.
````

Example policy or handbook with frontmatter (Tier 2):

````plaintext
---
title: expense-policy
description: "Guidelines for employee expense reporting and reimbursement"
tags: [policy, finance, procedures]
---

## What is it?

Policy summary.

## Why use it?

Reasoning.

## How to use it?

Rules and process.
````

## Validation & Quality

- Prefer short, focused pages. Break large topics into multiple pages.
- Ensure examples are copy-paste ready and runnable when possible.
- Run your project's formatting tooling (Prettier, markdownlint, etc.) and follow linting guidance for any embedded code snippets.

## Governance

- Keep a canonical source for MDX/Markdown rules in your project (e.g., a SKILL file or style guide).
- When rules change, update the canonical source and archive the prior version for reference.

## Limitations & Trade-offs

- Strict formatting and frontmatter requirements add authoring overhead but improve discoverability and machine readability.
