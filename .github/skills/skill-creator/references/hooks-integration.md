# Claude Code Hooks Integration

Guide for integrating Agent Skills with Claude Code hooks to automate workflows and enhance agent capabilities.

## What are Hooks?

Hooks are custom shell commands that execute automatically when specific events occur in your Claude Code session. They enable:

- **Automation**: Eliminate repetitive manual steps
- **Enforcement**: Apply project rules automatically
- **Context injection**: Feed dynamic information to Claude

## Hook Types Overview

| Hook                | When It Fires              | Use Case                        |
| ------------------- | -------------------------- | ------------------------------- |
| `SessionStart`      | When a session begins      | Inject project context          |
| `PreToolUse`        | Before a tool executes     | Validate or block actions       |
| `PostToolUse`       | After a tool completes     | Format, lint, or process output |
| `PermissionRequest` | When Claude needs approval | Auto-approve safe commands      |
| `PreCompact`        | Before context compaction  | Backup important context        |
| `Stop`              | When Claude finishes       | Verify work completion          |
| `SubagentStop`      | When a subagent finishes   | Process subagent results        |
| `UserPromptSubmit`  | When user submits a prompt | Augment user requests           |

## Configuration Format

Hooks are configured in `settings.json`:

```json
{
  "hooks": {
    "HookType": [
      {
        "matcher": "pattern",
        "hooks": [
          {
            "type": "command",
            "command": "shell command to run"
          }
        ]
      }
    ]
  }
}
```

### Configuration Locations

| Scope   | Location                    |
| ------- | --------------------------- |
| Project | `.claude/settings.json`     |
| User    | `~/.claude/settings.json`   |
| System  | `/etc/claude/settings.json` |

## Skills + Hooks Integration Patterns

### Pattern 1: Auto-format on Skill Execution

When a skill writes files, automatically format them:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

### Pattern 2: Inject Skill Context at Session Start

Load project status and available skills when starting:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '## Available Skills' && ls -1 .claude/skills/ 2>/dev/null || echo 'No skills found'"
          }
        ]
      }
    ]
  }
}
```

### Pattern 3: Auto-approve Skill Scripts

Pre-approve safe commands that skills commonly use:

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "Bash(npm run build*)",
        "hooks": [
          {
            "type": "command",
            "command": "echo '{\"decision\": \"allow\", \"reason\": \"Safe: npm run build\"}'"
          }
        ]
      },
      {
        "matcher": "Bash(npm run lint*)",
        "hooks": [
          {
            "type": "command",
            "command": "echo '{\"decision\": \"allow\", \"reason\": \"Safe: npm run lint\"}'"
          }
        ]
      },
      {
        "matcher": "Bash(python scripts/*)",
        "hooks": [
          {
            "type": "command",
            "command": "echo '{\"decision\": \"allow\", \"reason\": \"Safe: skill script\"}'"
          }
        ]
      }
    ]
  }
}
```

### Pattern 4: Block Dangerous Commands

Prevent execution of destructive commands:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/block-dangerous.sh"
          }
        ]
      }
    ]
  }
}
```

**block-dangerous.sh:**

```bash
#!/bin/bash
# Block dangerous commands
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.command // empty')

if echo "$COMMAND" | grep -qE 'rm -rf|sudo|chmod 777'; then
  echo '{"decision": "deny", "reason": "Blocked: dangerous command"}'
  exit 0
fi

# Allow by default
exit 0
```

### Pattern 5: Verify Skill Completion

Ensure skills complete their workflows properly:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Before completing, verify: 1) Did you run all validation steps? 2) Did you update documentation? 3) Did you test the changes? If any step was missed, continue. Otherwise, respond 'complete'."
          }
        ]
      }
    ]
  }
}
```

### Pattern 6: Backup Context Before Compaction

Preserve important context when Claude compacts memory:

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "auto",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/backup-context.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Responses

### Command Type Response

For `PreToolUse` and `PermissionRequest`, output JSON:

```json
{ "decision": "allow", "reason": "Approved by hook" }
```

```json
{ "decision": "deny", "reason": "Blocked: not allowed" }
```

### Exit Codes

| Exit Code | Meaning                        |
| --------- | ------------------------------ |
| 0         | Hook succeeded                 |
| Non-zero  | Hook failed (may block action) |

## Environment Variables

Available in hook commands:

| Variable                      | Description                |
| ----------------------------- | -------------------------- |
| `CLAUDE_TOOL_INPUT_FILE_PATH` | File being written/edited  |
| `CLAUDE_SESSION_ID`           | Current session identifier |
| (others)                      | Check Claude Code docs     |

## Best Practices

### 1. Keep Hooks Fast

Hooks should complete quickly to avoid blocking Claude:

```bash
# ✅ Good: Fast, async when possible
prettier --write "$FILE" 2>/dev/null &

# ❌ Bad: Slow, blocking
node slow-analysis-tool.js
```

### 2. Handle Errors Gracefully

Don't let hook failures break workflows:

```bash
# ✅ Good: Graceful failure
prettier --write "$FILE" 2>/dev/null || true

# ❌ Bad: Fails on error
prettier --write "$FILE"
```

### 3. Use Matchers Effectively

Target specific tools to avoid unnecessary hook execution:

```json
{
  "matcher": "Bash(npm*)",
  "hooks": [...]
}
```

### 4. Log for Debugging

Add logging for troubleshooting:

```bash
echo "[$(date)] Hook executed: $0" >> .claude/hooks.log
```

## Security Considerations

1. **Validate inputs**: Don't trust hook inputs blindly
2. **Avoid secrets**: Don't hardcode credentials in hooks
3. **Limit scope**: Use matchers to target specific actions
4. **Audit logs**: Record hook executions for review
5. **Review scripts**: Audit hook scripts before deployment

## Example: Complete Skills Integration

Full `settings.json` for a skill-enabled project:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '## Project Status' && git status --short && echo '---' && echo '## Available Skills' && ls -1 .claude/skills/ 2>/dev/null || echo 'No skills'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null && eslint \"$CLAUDE_TOOL_INPUT_FILE_PATH\" --fix 2>/dev/null || true"
          }
        ]
      }
    ],
    "PermissionRequest": [
      {
        "matcher": "Bash(npm run *)",
        "hooks": [
          {
            "type": "command",
            "command": "echo '{\"decision\": \"allow\", \"reason\": \"Safe npm command\"}'"
          }
        ]
      },
      {
        "matcher": "Bash(python scripts/*)",
        "hooks": [
          {
            "type": "command",
            "command": "echo '{\"decision\": \"allow\", \"reason\": \"Safe skill script\"}'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/validate-command.sh"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Verify: 1) Build passes? 2) Lint passes? 3) Tests pass? 4) Docs updated? Continue if incomplete."
          }
        ]
      }
    ]
  }
}
```

## Related Resources

- [Claude Code Hooks Documentation](https://code.claude.com/docs/en/hooks-guide)
- [Agent Skills Specification](https://agentskills.io/specification)
- [Example Hooks](https://github.com/anthropics/skills)
