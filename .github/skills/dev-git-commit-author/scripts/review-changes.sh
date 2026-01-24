#!/usr/bin/env bash
# Git Changes Reviewer Script
# Purpose: Display staged and unstaged changes for commit message generation
# No input required - shows current repository changes

set -euo pipefail

# Display help information
show_help() {
    cat << EOF
Git Changes Reviewer

Usage: $(basename "$0") [OPTIONS]

Display staged and unstaged changes for commit message generation.

Options:
    -h, --help     Show this help message
    -q, --quiet    Show only summary (no full diffs)

Examples:
    $(basename "$0")              # Show all changes
    $(basename "$0") --quiet      # Show only summary

EOF
}

# Parse command line arguments
QUIET_MODE=false
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -q|--quiet)
            QUIET_MODE=true
            shift
            ;;
        *)
            echo "Error: Unknown option: $1" >&2
            show_help
            exit 1
            ;;
    esac
done

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}=== Git Changes Review ===${NC}\n"

# Check if in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${YELLOW}Not a git repository${NC}"
    exit 1
fi

# Show staged changes
echo -e "${GREEN}Staged changes:${NC}"
if git diff --cached --quiet; then
    echo "  (none)"
else
    git diff --cached --stat
    
    if [ "$QUIET_MODE" = false ]; then
        echo ""
        echo -e "${CYAN}Staged diff (first 500 lines):${NC}"
        # Limit diff output to prevent terminal flooding/hanging
        diff_lines="$(git diff --cached | wc -l)"
        
        if [ "$diff_lines" -gt 500 ]; then
            git diff --cached | head -n 500
            echo -e "\n${YELLOW}... (diff truncated, ${diff_lines} total lines) ...${NC}"
        else
            git diff --cached
        fi
    fi
fi

echo -e "\n${YELLOW}Unstaged changes:${NC}"
if git diff --quiet; then
    echo "  (none)"
else
    git diff --stat
fi

# Show untracked files
if [ "$QUIET_MODE" = false ]; then
    UNTRACKED="$(git ls-files --others --exclude-standard)"
    if [ -n "$UNTRACKED" ]; then
        echo -e "\n${YELLOW}Untracked files:${NC}"
        printf "%s\n" "$UNTRACKED"
    fi
fi

# Summary for commit message generation
echo -e "\n${CYAN}=== Commit Message Suggestions ===${NC}"
if ! git diff --cached --quiet; then
    echo "Based on staged changes:"
    git diff --cached --stat | head -n 5 | sed 's/^/  /'
    
    # Show file count
    file_count="$(git diff --cached --name-only | wc -l)"
    echo -e "\n  ${GREEN}Total files changed: ${file_count}${NC}"
else
    echo -e "${YELLOW}No staged changes. Stage files with 'git add' first.${NC}"
fi

exit 0
