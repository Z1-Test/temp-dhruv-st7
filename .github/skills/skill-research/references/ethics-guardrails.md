# Ethics Guardrails

Academic integrity rules for research skill outputs.

---

## Core Rules

### ❌ Never Do

| Rule | Violation Example |
|------|-------------------|
| **No fabricated citations** | Inventing a source that doesn't exist |
| **No fake statistics** | "Studies show 80%..." without source |
| **No invented quotes** | Attributing words not in the source |
| **No hallucinated authors** | Citing non-existent researchers |

### ✅ Always Do

| Rule | Correct Example |
|------|-----------------|
| **Attribute all claims** | "According to MDN..." |
| **Mark speculation** | "This suggests..." vs "This proves..." |
| **Cite actual sources** | Link to real, verifiable URLs |
| **Note limitations** | "Based on available sources..." |

---

## Speculation Marking

When making inferences beyond direct source content:

| Type | Marker | Example |
|------|--------|---------|
| Direct citation | None needed | "Container queries use @container" |
| Inference | "This suggests..." | "This suggests improved performance" |
| Opinion | "One could argue..." | "One could argue this is cleaner" |
| Speculation | "Speculatively..." | "Speculatively, future versions may..." |

### Required Disclaimer

When research involves significant inference:

```markdown
> **Note**: Some conclusions in this report are inferred from available 
> sources and should be verified before use in critical decisions.
```

---

## Citation Standards

### Minimum Requirements

Every factual claim must have:
- Source URL (verifiable)
- Source title or description
- Source type classification

### Citation Format

```markdown
[Source Title](URL) - Type
```

### Unverifiable Claims

If a claim cannot be attributed:
- Omit the claim, OR
- Mark explicitly: "Commonly stated but unverified: ..."

---

## Conflict of Interest

Note when sources may have bias:

| Source | Potential Bias | Action |
|--------|----------------|--------|
| Vendor blog about own product | Promotional | Note in bias section |
| Competitor comparison | Self-serving | Seek neutral sources |
| Sponsored content | Commercial | Disclose or avoid |

---

## Error Acknowledgment

When the skill cannot complete research ethically:

```markdown
## Research Incomplete

Unable to produce a complete research report because:
- Insufficient verifiable sources found
- Available sources are primarily promotional
- Topic requires expertise beyond available sources

Recommended: Consult domain experts or academic databases.
```

---

## Researcher Responsibility

This skill is a tool, not a replacement for researcher judgment.

| Skill Provides | Researcher Must |
|----------------|-----------------|
| Structured synthesis | Verify critical claims |
| Source aggregation | Assess source quality |
| Pattern identification | Apply domain expertise |
| Gap detection | Make final judgments |
