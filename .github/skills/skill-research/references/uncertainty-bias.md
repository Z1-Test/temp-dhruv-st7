# Uncertainty & Bias Handling

Guidelines for handling uncertainty, source bias, and confidence in research outputs.

---

## Claim Verification States

Mark each key claim with its verification status:

| State | Marker | Meaning |
|-------|--------|---------|
| Verified | `[verified]` | Confirmed by 2+ authoritative sources |
| Unverified | `[unverified]` | Single source or non-authoritative |
| Contested | `[contested]` | Sources disagree |

### Usage in Key Points

```markdown
#### Key Points
- Container queries are Baseline 2023 [verified]
- Performance impact is negligible [unverified]
- Works with all frameworks [contested]
```

---

## Source Type Bias Matrix

Different source types have different biases:

| Source Type | Typical Bias | Reliability | Best For |
|-------------|--------------|-------------|----------|
| Official docs | Conservative, may lag features | High | Syntax, API details |
| Vendor blogs | Promotional, optimistic | Medium | New features, roadmaps |
| Dev blogs | Personal experience, edge cases | Medium | Real-world usage |
| News | Hype cycles, simplification | Low | Announcements |
| Academic | Rigorous, may be outdated | High | Theory, foundations |
| Stack Overflow | Problem-focused, varying quality | Variable | Troubleshooting |

### Bias Notes in Output

When source type affects reliability:

```markdown
> **Note**: Browser support claims from vendor blog (Chrome Developers) 
> may not reflect all browsers equally.
```

---

## Confidence Level Criteria

### High Confidence

All of:
- 3+ authoritative sources agree
- Official documentation cited
- Recent publication dates (< 1 year for tech)
- No contradictions found
- All facets well-covered

### Medium Confidence

Any of:
- 1-2 reliable sources per claim
- Mix of official and community sources
- Some claims unverified
- Minor contradictions explained

### Low Confidence

Any of:
- Single source only
- Blog/opinion content primarily
- Significant contradictions unresolved
- Outdated sources (> 2 years for tech)
- Major facets missing coverage

---

## Missing Literature Detection

Flag when research may be incomplete:

| Signal | Action |
|--------|--------|
| < 3 sources found for broad topic | Warn: "Limited sources available" |
| No official docs found | Warn: "No authoritative sources" |
| All sources > 1 year old | Warn: "May contain outdated information" |
| Key subtopics have no coverage | List: "Not covered: [topics]" |

### Output Example

```markdown
> **Research Limitations**
> - Limited sources (3 found, 5-7 recommended for broad topic)
> - No coverage found for: error handling, migration paths
> - All sources pre-date 2024; check for recent updates
```

---

## Contradiction Handling Workflow

When sources disagree, follow this canonical workflow:

1. **Document both positions clearly** — Present each position with a short, sourced statement.
2. **Check source types** — Label each source (e.g., Official docs, Vendor, Academic, Community) and note typical biases.
3. **Check recency** — Compare publication dates; for fast-moving tech, newer sources typically have precedence (particularly < 1 year).
4. **Attempt resolution** — Look for corroborating sources or authoritative clarifications; if found, document why one side is favored.
5. **Mark as `[contested]` if unresolved** — Label unresolved claims with `[contested]` in key points and facet summaries.
6. **Explain the discrepancy in the facet overview** — Provide a concise explanation of why sources differ and what evidence is missing or contested.

**Example**:

```markdown
#### Browser Support (contested)

- **Chrome Developers (2024)**: Full support since Chrome 105 [vendor]
- **MDN (2023)**: Partial support; some features behind flags [community]

**Resolution**: MDN's information is older and may not reflect the recent shipping status; mark as `[contested]` and recommend re-checking MDN and browser release notes.
```

**Notes:**
- Use this section as the single source of truth for contradiction handling; reference it from SKILL.md and other docs.
- Add `[contested]` markers in Key Points and facet overviews when contradictions remain unresolved.

