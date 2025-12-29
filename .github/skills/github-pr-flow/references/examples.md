# Examples: GitHub PR Flow

The following example illustrates a common PR flow.

## Opening a Feature PR

```javascript
// 1. Create Branch
create_branch({
  owner: "org",
  repo: "repo",
  branch: "feat/new-ui",
  from_branch: "main",
});

// 2. Create PR
create_pull_request({
  owner: "org",
  repo: "repo",
  title: "Feat: New UI Layout",
  body: "Implements the new design system.",
  head: "feat/new-ui",
  base: "main",
  draft: true,
});
```
