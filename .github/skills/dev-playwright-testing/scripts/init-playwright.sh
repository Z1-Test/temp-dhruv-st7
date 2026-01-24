#!/usr/bin/env sh
set -eu

# init-playwright.sh
# Initialize Playwright in the current project using Playwright docs:
# - https://playwright.dev/docs/intro
# - https://playwright.dev/docs/getting-started-vscode

usage() {
  cat <<EOF
Usage: $0

This script will ensure a package.json exists, install Playwright Test, install browser dependencies,
run Playwright's test init (non-interactive), and add useful npm scripts to package.json.

It assumes Node.js (v16+) and npm are available.
EOF
}

DRY_RUN=false
ASSUME_YES=false

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --yes) ASSUME_YES=true ;;
    --help) usage; exit 0 ;;
  esac
done

if [ "$DRY_RUN" = true ]; then
  echo "DRY-RUN mode: no file modifications will be made. Use --yes to apply changes.";
fi

echo "== Playwright initialization script =="

# Prerequisite checks
check_cmd() { command -v "$1" >/dev/null 2>&1 || { echo "Error: $1 is not installed or not on PATH. Install it before running this script."; exit 2; } }
check_cmd node
check_cmd npm
check_cmd npx

# Node version check (warn if <24)
NODE_MAJOR=$(node -v | sed 's/^v\([0-9]*\).*/\1/') || NODE_MAJOR=0
if [ "$NODE_MAJOR" -lt 24 ]; then
  echo "Warning: Node major version is v$NODE_MAJOR; this project targets Node 24 LTS. Proceed if you know what you are doing."
fi

# Ensure package.json exists — optionally create it
if [ ! -f package.json ]; then
  if [ "$DRY_RUN" = true ]; then
    echo "(dry-run) Would run: npm init -y"
  else
    if [ "$ASSUME_YES" = true ]; then
      echo "Creating package.json with 'npm init -y'"
      npm init -y
    else
      printf "No package.json found — create one now? [y/N] "
      read -r resp
      if [ "${resp:-n}" = "y" ] || [ "${resp:-n}" = "Y" ]; then
        npm init -y
      else
        echo "Aborting. Create a package.json and re-run the script."; exit 1
      fi
    fi
  fi
fi

# Install Playwright Test
if [ "$DRY_RUN" = true ]; then
  echo "(dry-run) Would run: npm install -D @playwright/test"
else
  echo "Installing @playwright/test as dev dependency..."
  npm install -D @playwright/test
fi

# Install browsers (with deps for Linux)
if [ "$DRY_RUN" = true ]; then
  echo "(dry-run) Would run: npx playwright install --with-deps"
else
  echo "Installing Playwright browsers (with deps)..."
  npx playwright install --with-deps
fi

# Run Playwright init non-interactively (adds config & example tests)
if [ "$DRY_RUN" = true ]; then
  echo "(dry-run) Would run: npx playwright test --init --yes"
else
  echo "Running 'npx playwright test --init --yes' to scaffold config and examples..."
  npx playwright test --init --yes || true
fi

# Add common helper scripts to package.json using node (safe merge). Create a backup first.
if [ "$DRY_RUN" = true ]; then
  echo "(dry-run) Would update package.json scripts (backup not created in dry-run)"
else
  BACKUP="package.json.bak.$(date +%s)"
  cp package.json "$BACKUP"
  echo "Backed up package.json -> $BACKUP"

  echo "Adding canonical Playwright npm scripts to package.json..."
  node - <<'NODE'
const fs = require('fs');
const path = './package.json';
const p = JSON.parse(fs.readFileSync(path));
const scripts = p.scripts || {};
const add = {
  "playwright:install": "npx playwright install --with-deps",
  "test": "playwright test",
  "test:ci": "playwright test --reporter=list",
  "test:debug": "playwright test --debug",
  "test:headed": "playwright test --headed",
  "test:trace": "playwright test --trace=on-first-retry",
  "test:update-snapshots": "playwright test --update-snapshots",
  "test:grep": "playwright test -g",
  "test:flaky": "playwright test --repeat-each=3 --workers=1 --trace=on-first-retry",
  "test:report": "playwright show-report",
  "ci:prepare": "npm ci && npm run playwright:install"
};
for (const k of Object.keys(add)) scripts[k] = scripts[k] || add[k];
p.scripts = scripts;
fs.writeFileSync(path, JSON.stringify(p, null, 2) + "\n");
console.log('Updated package.json scripts.');
NODE
fi

# Add or merge VS Code extension recommendation (non-destructive)
if [ "$DRY_RUN" = true ]; then
  echo "(dry-run) Would add .vscode/extensions.json with 'ms-playwright.playwright' recommendation"
else
  if [ ! -d .vscode ]; then
    mkdir -p .vscode
  fi
  EXT_PATH=.vscode/extensions.json
  if [ -f "$EXT_PATH" ]; then
    if grep -q 'ms-playwright.playwright' "$EXT_PATH"; then
      echo "VS Code recommendation already present"
    else
      # Merge by appending to recommendations array if JSON is simple
      tmp=$(mktemp)
      jq '.recommendations += ["ms-playwright.playwright"] | .recommendations |= (unique)' "$EXT_PATH" > "$tmp" && mv "$tmp" "$EXT_PATH" || echo 'Warning: Could not merge .vscode/extensions.json; left unchanged.'
      echo "Merged Playwright recommendation into $EXT_PATH"
    fi
  else
    cat > "$EXT_PATH" <<'JSON'
{
  "recommendations": [
    "ms-playwright.playwright"
  ]
}
JSON
    echo "Created $EXT_PATH"
  fi
fi

# Usage hint
cat <<EOF
Done. Next steps:
  - Run 'npm test' to run example tests.
  - Run 'npm run test:debug' to open the Playwright inspector.
  - Re-run 'npx playwright install --with-deps' in CI or on new machines.

Notes:
  - The script runs 'npx playwright test --init --yes' (accepts defaults). If you want to customize,
    edit the generated playwright.config.* and example tests.
  - If you ran without --yes, you may need to accept generated files manually.
EOF

exit 0
