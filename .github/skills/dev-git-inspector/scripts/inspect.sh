#!/usr/bin/env bash
# Git Repository Inspector Script
# Purpose: Read-only inspection of repository state with JSON output
# No input required - uses current repository state

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Initialize report fields
CLEAN=false
CURRENT_BRANCH=""
DETACHED_HEAD=false
UPSTREAM=""
AHEAD=0
BEHIND=0
SAFE_TO_PROCEED=false
STATUS_SUMMARY=""

# Check if in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    exit 1
fi

# JSON escape function - pure bash, no dependencies
# Escapes: backslash, double-quote, newline, tab, carriage return
json_escape() {
    local string="$1"
    # Escape backslashes first (must be first!)
    string="${string//\\/\\\\}"
    # Escape double quotes
    string="${string//\"/\\\"}"
    # Escape control characters
    string="${string//$'\n'/\\n}"
    string="${string//$'\t'/\\t}"
    string="${string//$'\r'/\\r}"
    printf '%s' "$string"
}

# JSON string or null helper
json_string_or_null() {
    local value="$1"
    if [ -z "$value" ] || [ "$value" = "null" ]; then
        printf 'null'
    else
        printf '"%s"' "$(json_escape "$value")"
    fi
}


# Check cleanliness
if [ -z "$(git status --porcelain)" ]; then
    CLEAN=true
fi

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
if [ "$CURRENT_BRANCH" = "HEAD" ]; then
    DETACHED_HEAD=true
    CURRENT_BRANCH="null"
fi

# Get upstream and ahead/behind counts
if [ "$DETACHED_HEAD" = false ]; then
    UPSTREAM=$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo "")
    
    if [ -n "$UPSTREAM" ]; then
        # Get ahead/behind counts using robust git rev-list method
        AHEAD=$(git rev-list --count @{u}..HEAD 2>/dev/null || echo "0")
        BEHIND=$(git rev-list --count HEAD..@{u} 2>/dev/null || echo "0")
    fi
fi

# Determine safe_to_proceed
if [ "$CLEAN" = true ] && [ "$BEHIND" -eq 0 ] && [ "$DETACHED_HEAD" = false ]; then
    SAFE_TO_PROCEED=true
fi

# Generate status summary
if [ "$DETACHED_HEAD" = true ]; then
    STATUS_SUMMARY="Clean working tree, detached HEAD, no upstream tracking"
elif [ "$CLEAN" = true ]; then
    if [ -z "$UPSTREAM" ]; then
        STATUS_SUMMARY="Clean working tree on $CURRENT_BRANCH, no upstream"
    elif [ "$AHEAD" -eq 0 ] && [ "$BEHIND" -eq 0 ]; then
        STATUS_SUMMARY="Clean working tree on $CURRENT_BRANCH, tracking $UPSTREAM, up-to-date"
    elif [ "$AHEAD" -gt 0 ] && [ "$BEHIND" -eq 0 ]; then
        STATUS_SUMMARY="Clean working tree on $CURRENT_BRANCH, tracking $UPSTREAM, $AHEAD ahead"
    elif [ "$AHEAD" -eq 0 ] && [ "$BEHIND" -gt 0 ]; then
        STATUS_SUMMARY="Clean working tree on $CURRENT_BRANCH, tracking $UPSTREAM, $BEHIND behind"
    else
        STATUS_SUMMARY="Clean working tree on $CURRENT_BRANCH, tracking $UPSTREAM, $AHEAD ahead, $BEHIND behind"
    fi
else
    if [ "$AHEAD" -gt 0 ]; then
        STATUS_SUMMARY="Dirty working tree on $CURRENT_BRANCH, tracking $UPSTREAM, $AHEAD ahead"
    else
        STATUS_SUMMARY="Dirty working tree on $CURRENT_BRANCH, tracking ${UPSTREAM:-no upstream}"
    fi
fi

# Build JSON output with proper escaping
cat <<EOF
{
  "clean": $CLEAN,
  "current_branch": $(json_string_or_null "$CURRENT_BRANCH"),
  "detached_head": $DETACHED_HEAD,
  "upstream": $(json_string_or_null "$UPSTREAM"),
  "ahead": $AHEAD,
  "behind": $BEHIND,
  "safe_to_proceed": $SAFE_TO_PROCEED,
  "status_summary": "$(json_escape "$STATUS_SUMMARY")"
}
EOF


# Exit with appropriate code
if [ "$SAFE_TO_PROCEED" = true ]; then
    exit 0
else
    exit 1
fi
