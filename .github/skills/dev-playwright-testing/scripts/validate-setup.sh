#!/bin/bash
# Playwright Setup Validation Script
# Automates verification of environment setup for testing

set -e

PASS=0
FAIL=0

echo "🔍 Validating Playwright Testing Setup..."
echo ""

# Check Playwright installation
echo -n "Checking Playwright installation... "
if grep -q "@playwright/test" package.json 2>/dev/null; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "❌ FAIL - @playwright/test not in package.json"
  ((FAIL++))
fi

# Check Playwright CLI
echo -n "Checking Playwright CLI... "
if npx playwright --version &>/dev/null; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "❌ FAIL - Run: npx playwright install"
  ((FAIL++))
fi

# Check config file
echo -n "Checking playwright.config.ts... "
if [ -f "playwright.config.ts" ]; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "❌ FAIL - Missing configuration file"
  ((FAIL++))
fi

# Check test directory
echo -n "Checking test directory (src/e2e/)... "
if [ -d "src/e2e" ]; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "⚠️  WARN - Directory src/e2e/ not found"
fi

# Check .env.example
echo -n "Checking .env.example... "
if [ -f ".env.example" ] || [ -f "assets/.env.example" ]; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "⚠️  WARN - No .env.example found"
fi

# Check .gitignore for test artifacts
echo -n "Checking .gitignore for test artifacts... "
if grep -q "test-results" .gitignore 2>/dev/null && grep -q "playwright-report" .gitignore 2>/dev/null; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "❌ FAIL - Add test-results/ and playwright-report/ to .gitignore"
  ((FAIL++))
fi

# Check TypeScript config
echo -n "Checking tsconfig.json... "
if [ -f "tsconfig.json" ]; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "⚠️  WARN - No tsconfig.json found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Results: $PASS passed, $FAIL failed"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAIL -gt 0 ]; then
  echo "❌ Setup validation FAILED. Fix errors above."
  exit 1
else
  echo "✅ Setup validation PASSED. Ready for testing!"
  exit 0
fi
