#!/usr/bin/env sh
set -eu

# install-browsers.sh
# Installs Playwright browser binaries (useful for CI).

if [ "${1:-}" = "--help" ]; then
  echo "Usage: $0\nRuns: npx playwright install --with-deps"
  exit 0
fi

echo "Installing Playwright browsers (with deps)..."
npx playwright install --with-deps

echo "Done."
