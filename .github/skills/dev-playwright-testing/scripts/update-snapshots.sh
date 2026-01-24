#!/usr/bin/env sh
set -eu

# update-snapshots.sh
# Update Playwright snapshots across the repo

if [ "${1:-}" = "--help" ]; then
  echo "Usage: $0\nRuns: npx playwright test --update-snapshots"
  exit 0
fi

npx playwright test --update-snapshots

echo "Snapshot update complete. Review changes and commit intentionally."
