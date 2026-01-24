#!/usr/bin/env sh
set -eu

# open-report.sh
# Open the Playwright HTML report (if present)

if [ "${1:-}" = "--help" ]; then
  echo "Usage: $0\nRuns: npx playwright show-report"
  exit 0
fi

if [ ! -d playwright-report ]; then
  echo "No 'playwright-report' directory found. Try running 'npx playwright test' first."
  exit 1
fi

npx playwright show-report "$@"
