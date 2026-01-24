---
name: research
description: Perform structured research on topics, URLs, or documentation sites. Triggers on research, study, explore, investigate, analyze, gather resources, deep research, crawl docs, fetch all pages, and sitemap research. Discovers child pages via sitemap for comprehensive documentation analysis.
metadata:
  category: research
---

# Comprehensive Research

## What is it?

A structured research skill that generates comprehensive Markdown reports from topics or URLs. It automatically detects topic scope (narrow/moderate/broad) and organizes findings into facet-based sections within a single, well-organized file.

## Why use it?

- **Multi-faceted coverage**: Decomposes broad topics into organized subsections
- **Scope-aware depth**: Adapts research depth based on topic complexity
- **Structured output**: Consistent markdown format with facets, cross-cutting insights, and sources
- **Zero dependencies**: Uses built-in agent tools (web search, fetch, browser)

## Research Problem Addressed

> Researchers struggle with **synthesizing scattered information** during the **exploration and literature review phases**.

## Skill Intent

This skill helps researchers **gather and synthesize information** by **systematically collecting and organizing sources** to produce **structured, citable research reports**.

## How to use it?

| Scope        | Indicators                                  | Examples                                                     | Sections | Sources |
| ------------ | ------------------------------------------- | ------------------------------------------------------------ | -------- | ------- |
| **Narrow**   | Single concept, specific API, one feature   | "Firebase Auth `onAuthStateChanged`", "Firestore `getDoc()`" | 1-2      | 2-3     |
| **Moderate** | Feature set, library, technology comparison | "Firebase Security Rules", "Firestore vs Realtime DB"        | 3-4      | 4-6     |
| **Broad**    | Entire framework, ecosystem, methodology    | "Firebase ecosystem", "Firebase serverless architecture"     | 5+       | 7-10    |

**Scope Detection Algorithm**:

1. Check for version-specific or API-specific terms → Narrow
2. Check if topic is subset of larger framework → Narrow/Moderate
3. Check if topic represents entire framework/methodology → Moderate/Broad
4. When uncertain, start with Moderate scope and adapt or ask user.

### Step 1: Determine Input Type

- **Topic** (no URL) → Web search for sources
- **URL** (http/https) → Fetch and extract content

### Step 2: Research Execution

**For Topics:**
1. Search using 2-3 query variations (e.g., "CSS aspect-ratio", "aspect-ratio property CSS", "CSS aspect-ratio browser support")
2. Collect sources based on scope level
3. Prioritize: Official docs > Academic > Vendor > Non-Authoritative

**Authoritative Sources Defined:**
- **Official Documentation**: MDN, W3C, framework official docs, standards bodies
- **Academic**: Published papers, university research, IEEE, ACM
- **Vendor**: Chrome Developers, Mozilla Hacks (authoritative but may have bias)
- **Non-Authoritative**: Personal blogs, Stack Overflow, tutorials (useful but require verification)

**For URLs:**

1. Validate URL format
2. Fetch content using `read_url_content` or `browser_subagent`
3. Extract title, headings, content, metadata

### Step 2b: Deep Research Mode (Child Pages)

**Activation Criteria** (any of these):
1. User explicitly says "deep", "comprehensive", "all pages", "complete"
2. URL path contains: `/learn/`, `/tutorial/`, `/guide/`, `/docs/` with subtopics
3. Parent page has clear table of contents with 5+ child links


Apply these rules to all fetch operations (sitemaps, child page fetches, and single-page requests). These rules are authoritative and should not be duplicated elsewhere; other sections should reference this block for pacing guidance.

#### Discover Child Pages

1. **Sitemap Discovery** (preferred)

   - Fetch `{origin}/sitemap.xml` or parse from `robots.txt`
   - Filter URLs matching parent path prefix
   - Example: `https://web.dev/learn/css` → filter for `/learn/css/*`

2. **Link Crawling Fallback** (if no sitemap)
   - Parse parent page HTML for internal `<a href>` links
   - Resolve relative URLs, filter by parent path prefix
   - Limit to same-origin, 1 level deep

#### Prioritize & Limit Pages

| Site Type       | Max Pages | Strategy                      |
| --------------- | --------- | ----------------------------- |
| Tutorial/Course | 20        | **Batching** (20 per report)  |
| Documentation   | 15        | Core sections                 |
| Blog series     | 10        | Most recent                   |

#### Batching Strategy for Large Sites

When a course or documentation set exceeds the `Max Pages` limit:

1.  **Process current batch**: Fetch and analyze up to the maximum allowed pages.
2.  **Document the gap**: In the `Research Limitations` section, explicitly list the number of remaining pages and a sample of the missed URLs.
3.  **Generate "Next Step" prompt**: Append a "Sequential Research" section at the end of the file with the exact prompt the user should run next (e.g., `Deep research [Next URL] - start from chapter 21`).
4.  **Reference hierarchy**: In the metadata of Part 2, include `part_of: [Previous Filename]` to maintain traceability.

#### Sitemap Fallback Strategy

If sitemap parsing fails or returns 0 pages:

1. **Try alternative sitemap locations** (in order):

   - `/sitemap.xml`
   - `/sitemap_index.xml`
   - Check `/robots.txt` for sitemap reference

2. **If all fail**, use browser tool to extract links from homepage:

   - Extract all same-domain links from navigation and content
   - Limit depth to 2 levels maximum
   - Respect robots.txt directives

3. **Document in report**: Add note under **Research Limitations** section:
   
   Example:
   ```markdown
   ## Research Limitations
   
   - Used fallback link extraction (no sitemap found)
   - [other limitations]
   ```

#### Fetch Responsibly

**STRICT LIMIT**: Max 3 concurrent requests.
- **Fallback**: If `fetch` fails (403/429), strictly follow the `Failed Resources` protocol or try the `browser` tool if permitted.
- Handle failures gracefully and track them in the Failed Resources section so users can manually retry important resources.

#### Track Failed Resources

When a fetch fails, record it for the "Failed Resources" section:

| Failure Type       | Action                   | Retry?           |
| ------------------ | ------------------------ | ---------------- |
| Timeout (>30s)     | Log URL + "timeout"      | Yes              |
| Rate limited (429) | Log URL + "rate limited" | Yes, after delay |
| Blocked (403)      | Log URL + "blocked"      | Try browser tool |
| Network error      | Log URL + error message  | Yes              |

Include in output so user can manually retry important resources.

#### Aggregate Content

- Fetch each child page
- Organize facets by URL hierarchy
- Cross-reference insights across all pages

See [child-page-discovery.md](references/child-page-discovery.md) for detailed implementation guidance.

### Step 3: Structure by Facets

For moderate/broad topics, organize into facets:

- Technical components / features
- Use cases / applications
- Best practices / patterns
- Common problems / solutions

Each facet has: Overview → Key Points → Sources

**Cross-Cutting Insights** (required for moderate/broad):
Patterns or themes that span multiple facets:
- "All sources emphasize X pattern across Y and Z features"
- "Browser support is the main limitation affecting adoption"
- "Performance considerations appear in 3 of 5 facets"

These synthesize overarching themes not specific to a single facet.

### Step 4: Synthesize & Generate

1. Cross-reference facts across sources
2. Identify patterns and contradictions
3. Write executive summary (2-3 sentences)
4. Save as `research-[sanitized-topic].md`

**Filename Sanitization Rules:**
- Convert to lowercase
- Replace spaces with hyphens
- Remove backticks, quotes, special characters (keep only: a-z, 0-9, hyphen)
- Limit the sanitized topic to 50 characters max (before adding prefix/extension)
- Examples: 
  - `CSS \`aspect-ratio\` property` → `research-css-aspect-ratio-property.md`
  - `React Server Components` → `research-react-server-components.md`

## Mandatory Checklist

Before completing, verify ALL items:

### Scope & Planning

- [ ] Topic scope identified (narrow/moderate/broad)
- [ ] Facets listed (if moderate/broad)
- [ ] Target source count determined

### Research Execution

- [ ] Web search completed (if topic-based)
- [ ] All sources fetched
- [ ] Content extracted and facts cross-referenced

### Synthesis & Output

- [ ] Executive summary written
- [ ] Each facet section completed
- [ ] Cross-cutting insights identified (moderate/broad)
- [ ] Sources table populated
- [ ] Failed resources logged and categorized
- [ ] Related topics listed (3-5 topics that naturally extend from research, e.g., adjacent technologies, complementary features, or next learning steps)
- [ ] Confidence level assessed (High/Medium/Low based on criteria)
- [ ] File saved with correct naming (sanitized per rules)

## Examples

### Narrow Topic

```
User: Research CSS Container Queries
```

→ Scope: Narrow, 2 facets, 3 sources
→ Output: `research-css-container-queries.md`

### Broad Topic

```
User: Research PWA development comprehensively
```

→ Scope: Broad, 5+ facets (Service Workers, Manifest, Caching, Push, Performance)
→ Output: `research-pwa-development.md`

### URL Analysis

```
User: https://web.dev/articles/web-components
```

→ Fetch, extract, organize into facets
→ Output: `research-web-components.md`

### Deep Research (Documentation Section)

```
User: Deep research https://web.dev/learn/css
```

→ Discover 25 child pages via sitemap
→ Analyze 20 pages (rate limited)
→ Organize into hierarchical facets by URL structure
→ Output: `research-learn-css.md`

## Error Handling

| Error             | Action                                   |
| ----------------- | ---------------------------------------- |
| Network error     | Report unreachable; suggest alternatives |
| Timeout (>30s)    | Report timeout                           |
| Empty content     | Report as empty                          |
| 403/Blocked       | Try browser tool                         |
| No search results | Broaden query; try related terms         |

## Research Reasoning Strategy

Uses **Thematic Synthesis** as primary pattern:

1. **Extract** key claims from each source
2. **Cluster** claims by similarity
3. **Cross-reference** across sources
4. **Identify** patterns and contradictions
5. **Synthesize** unified findings with attribution

**Contradiction Handling:** See the canonical workflow in [references/uncertainty-bias.md](references/uncertainty-bias.md) for the full procedure (document positions, check source types and recency, mark unresolved items as `[contested]`, and explain discrepancies in the facet overview).

Alternative patterns: Systematic Scan, Compare-Contrast, Gap Analysis.
See [reasoning-methods.md](references/reasoning-methods.md) for details.

## Uncertainty & Bias Handling

Mark research reliability explicitly:

| Marker         | Meaning                               |
| -------------- | ------------------------------------- |
| `[verified]`   | Confirmed by 2+ authoritative sources |
| `[unverified]` | Single source or non-authoritative    |
| `[contested]`  | Sources disagree                      |

**Verification Marker Placement:**
- Use in Key Points sections: `- Container queries support all browsers [verified]`
- Optional in Executive Summary for critical claims
- Do NOT use in headings or overview paragraphs

**Confidence Levels** (required in Metadata section):
- **Summary:** Use High / Medium / Low for a quick signal in metadata.
- **Authoritative criteria:** See the canonical definitions and detailed criteria in [references/uncertainty-bias.md](references/uncertainty-bias.md) (preferred single source of truth for confidence level rules).

## Failure Conditions

The skill explicitly fails (reports inability) when:

- Insufficient sources found (< 2 for narrow, < 4 for broad)
- Research question too vague to decompose into facets
- All sources contradict each other without resolution
- Time-sensitive topic with only stale sources (> 2 years)

## Ethics Guardrails

| ❌ Never              | ✅ Always                |
| --------------------- | ------------------------ |
| Fabricate citations   | Attribute all claims     |
| Invent statistics     | Mark speculation clearly |
| Hallucinate quotes    | Cite verifiable URLs     |
| Claim false certainty | Note limitations         |

See [ethics-guardrails.md](references/ethics-guardrails.md) for full policy.

## Limitations

- Cannot process PDF, ZIP, or binary file downloads
- Cannot handle API endpoints expecting JSON responses
- JavaScript-heavy pages may require browser tool instead of fetch

## Supporting References

- [child-page-discovery.md](references/child-page-discovery.md) - Child page discovery guide
- [reasoning-methods.md](references/reasoning-methods.md) - Reasoning patterns
- [uncertainty-bias.md](references/uncertainty-bias.md) - Uncertainty handling
- [ethics-guardrails.md](references/ethics-guardrails.md) - Academic integrity
- [research-report-template.md](assets/research-report-template.md) - Report template
