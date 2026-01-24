#!/usr/bin/env sh
set -eu

# debug.sh
# Run Playwright in debug mode (inspector)

check_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "Error: $1 is not installed or not on PATH. Install it before running this script."; exit 2; }
}

if [ "${1:-}" = "--help" ]; then
  cat <<'USAGE'
Usage: ./debug.sh [--grep <pattern>] [-- <playwright-args>]

Starts Playwright Test in debug/inspector mode.
Examples:
  ./debug.sh
  ./debug.sh --grep 'login'
  ./debug.sh -- --project=chromium
USAGE
  exit 0
fi

# Ensure npx is available
check_cmd npx

echo "Starting Playwright in debug mode..."
# Use npx for consistent behavior across environments
npx playwright test --debug "$@"
