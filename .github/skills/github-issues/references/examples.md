# Examples: GitHub Issues

The following examples illustrate common issue management workflows.

## Creating a Bug Report

```javascript
// Function Call
issue_write({
  owner: "tech-corp",
  repo: "app-core",
  title: "Bug: Login fails on Safari",
  body: "Steps to reproduce: ...",
  type: "Bug"
});
```

---

## Breaking down a Task (Sub-issues)

```javascript
// Function Call
sub_issue_write({
  owner: "tech-corp",
  repo: "app-core",
  issue_number: 101, // Parent issue number
  sub_issue_id: "I_kwDOABC123", // Child issue ID (not issue number - use issue_read to get ID)
  method: "add",
});
```

---

## Managing Milestones

### Listing Milestones

```bash
# Get all milestones to find the numeric 'number'
gh api /repos/tech-corp/app-core/milestones
```

### Creating a Milestone

```bash
# Create a new milestone using gh api
gh api -X POST /repos/tech-corp/app-core/milestones \
  -f title="v1.0-beta" \
  -f description="Beta release" \
  -f due_on="2025-12-31T23:59:59Z"
```

### Assigning an Issue to a Milestone

```javascript
// MCP Approach (Requires numeric number)
issue_write({
  owner: "tech-corp",
  repo: "app-core",
  issue_number: 123,
  milestone: 1, // Milestone NUMBER from API/List
});
```

```bash
# CLI Approach - **Assign Milestone (CLI)**:
    ```bash
    gh issue edit 42 --milestone "v1.0-MVP"
    ```

### Creating Issues with Types and Milestones (MCP - Recommended)
1. **List Issue Types**:
    Use `list_issue_types(owner="owner")` to find valid types (e.g., "Bug 🐞").
2. **Find Milestone Number**:
    Use `gh api /repos/OWNER/REPO/milestones` to find the integer number (e.g., 9).
3. **Create Issue**:
    Use `issue_write` with `type` (exact name) and `milestone` (integer).
    ```json
    {
      "method": "create",
      "owner": "Z1-Test",
      "repo": "whatsapp",
      "title": "Crash on Login",
      "body": "Description...",
      "type": "Bug 🐞",
      "milestone": 9
    }
    ```

### Managing Issue Types (GraphQL - Fallback)
If MCP is unavailable, use GraphQL to set type post-creation.

1. **Find Issue Type ID**:
    ```bash
    gh api graphql -f query='query{resource(url:"https://github.com/OWNER/REPO"){... on Repository{issueTypes(first:10){nodes{id,name}}}}}'
    ```

2. **Update Issue Type**:
    ```bash
    gh api graphql -f query='
      mutation($issueId: ID!, $typeId: ID!) {
        updateIssue(input: {id: $issueId, issueTypeId: $typeId}) {
          issue { id number title }
        }
      }' -f issueId="I_..." -f typeId="IT_..."
    ```
