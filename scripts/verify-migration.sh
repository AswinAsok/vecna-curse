#!/bin/bash

# Migration Verification Script
# This script runs all verification checks for the migration

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 Starting Migration Verification..."
echo "===================================="
echo ""

# Function to print success
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print error
error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    warning "node_modules not found. Installing dependencies..."
    pnpm install
fi

echo "📋 Phase 1: Testing Infrastructure"
echo "-----------------------------------"

# Check if test files exist
if [ -f "vitest.config.ts" ]; then
    success "Vitest config exists"
else
    error "Vitest config missing"
    exit 1
fi

if [ -f "src/test/setup.ts" ]; then
    success "Test setup file exists"
else
    error "Test setup file missing"
    exit 1
fi

# Run tests
echo ""
echo "Running tests..."
if pnpm test run 2>/dev/null; then
    success "All tests passed"
else
    error "Tests failed"
    exit 1
fi

# Check coverage
echo ""
echo "Checking test coverage..."
if pnpm test:coverage --run 2>/dev/null; then
    success "Coverage meets thresholds (80%+)"
else
    warning "Coverage below threshold or coverage not configured"
fi

echo ""
echo "📋 Phase 2: Code Quality"
echo "------------------------"

# Run linter
echo "Running ESLint..."
if pnpm lint 2>/dev/null; then
    success "No linting errors"
else
    error "Linting errors found"
    exit 1
fi

# Run TypeScript check
echo ""
echo "Running TypeScript check..."
if pnpm tsc --noEmit 2>/dev/null; then
    success "No type errors"
else
    error "Type errors found"
    exit 1
fi

echo ""
echo "📋 Phase 3: Accessibility"
echo "-------------------------"

# Check if Button component uses button element
if grep -q "return <button" src/components/ui/Button/Button.tsx 2>/dev/null; then
    success "Button component uses semantic HTML"
else
    warning "Button component may not use semantic HTML"
fi

# Run accessibility tests
echo ""
echo "Running accessibility tests..."
if pnpm test run -- Button.a11y.test 2>/dev/null; then
    success "Accessibility tests passed"
else
    warning "Accessibility tests not found or failed"
fi

echo ""
echo "📋 Phase 4: Architecture"
echo "------------------------"

# Check for API abstraction
if [ -f "src/lib/api/interfaces/IApiClient.ts" ]; then
    success "API abstraction layer exists"
else
    warning "API abstraction layer not implemented"
fi

# Check for error handling
if [ -f "src/lib/errors/AppError.ts" ]; then
    success "Custom error classes exist"
else
    warning "Custom error classes not implemented"
fi

if [ -f "src/components/errors/ErrorBoundary.tsx" ]; then
    success "Error boundary exists"
else
    warning "Error boundary not implemented"
fi

# Check for console.warn in production code
echo ""
echo "Checking for console statements in production code..."
if grep -r "console\.warn\|console\.log" src/ --include="*.ts" --include="*.tsx" --exclude-dir=test --exclude="*.test.*" -q 2>/dev/null; then
    warning "Console statements found in production code"
else
    success "No console statements in production code"
fi

echo ""
echo "📋 Phase 5: Documentation"
echo "-------------------------"

# Check for documentation files
if [ -f "MIGRATION_GUIDE.md" ]; then
    success "Migration guide exists"
else
    warning "Migration guide not found"
fi

if [ -f "docs/API.md" ]; then
    success "API documentation exists"
else
    warning "API documentation not found"
fi

echo ""
echo "===================================="
echo "✅ Verification Complete!"
echo ""

# Summary
echo "📊 Summary:"
echo "  • Testing infrastructure: Configured"
echo "  • Code quality: Passing"
echo "  • Type safety: Verified"
echo "  • Accessibility: Check manually"
echo "  • Architecture: Review needed"
echo ""

# Calculate rough score
SCORE=7.5
if [ -f "vitest.config.ts" ] && pnpm test run &>/dev/null; then
    SCORE=$(echo "$SCORE + 2.5" | bc)
fi
if [ -f "src/lib/api/interfaces/IApiClient.ts" ]; then
    SCORE=$(echo "$SCORE + 0.5" | bc)
fi
if [ -f "src/lib/errors/AppError.ts" ] && [ -f "src/components/errors/ErrorBoundary.tsx" ]; then
    SCORE=$(echo "$SCORE + 0.5" | bc)
fi

echo "📈 Estimated Current Score: $SCORE/10"
echo ""

if (( $(echo "$SCORE >= 10" | bc -l) )); then
    echo "🎉 Congratulations! You've reached 10/10!"
elif (( $(echo "$SCORE >= 9" | bc -l) )); then
    echo "🚀 Almost there! Just a few more improvements needed."
else
    echo "💪 Keep going! Refer to MIGRATION_GUIDE.md for next steps."
fi

echo ""
echo "For detailed migration steps, see: MIGRATION_GUIDE.md"
echo "For quick reference, see: MIGRATION_CHECKLIST.md"
