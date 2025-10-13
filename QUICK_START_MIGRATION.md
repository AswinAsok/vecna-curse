# Quick Start: Migration to 10/10

**Goal:** Improve code quality score from 7.5/10 to 10/10
**Timeline:** 4-6 weeks
**Team Size:** 2-3 developers

---

## TL;DR - Critical Actions

If you only have 1 week, do these 3 things:

1. **Add Testing** (Days 1-3)
   ```bash
   pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom
   # Copy vitest.config.ts from MIGRATION_GUIDE.md
   # Start writing tests for core modules
   ```

2. **Fix Button Accessibility** (Day 4)
   - Replace `<div>` with `<button>` in `src/components/ui/Button/Button.tsx`
   - Add keyboard support and ARIA attributes

3. **Add Error Boundary** (Day 5)
   - Create `ErrorBoundary.tsx` component
   - Wrap your app in `main.tsx`

---

## Getting Started

### Step 1: Review Current State

Run the verification script to see where you are:

```bash
./scripts/verify-migration.sh
```

This will show you:
- ✅ What's already done
- ⚠️ What needs attention
- 📊 Your current estimated score

### Step 2: Choose Your Path

#### Path A: Full Migration (Recommended)
Follow `MIGRATION_GUIDE.md` step-by-step through all phases.

**Timeline:** 4-6 weeks
**Impact:** 10/10 score
**Risk:** Low

#### Path B: Critical Only (Fast Track)
Complete only Phase 1 from the migration guide.

**Timeline:** 1-2 weeks
**Impact:** 8.5/10 score
**Risk:** Low

#### Path C: Gradual Migration
Complete one phase per sprint over 6 sprints.

**Timeline:** 6 sprints (12 weeks)
**Impact:** 10/10 score
**Risk:** Very Low

---

## Phase-by-Phase Quick Reference

### Phase 1: Critical Fixes (Week 1-2)

#### 1.1 Testing (5 days)

**Install:**
```bash
pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8
```

**Configure:** See `MIGRATION_GUIDE.md` Section 1.1.2-1.1.3

**Write Tests:**
```bash
# Create test files
touch src/core/validators/registry/emailValidator.test.ts
touch src/core/validators/registry/requiredValidator.test.ts
touch src/components/ui/Button/Button.test.tsx

# Run tests
pnpm test
```

**Goal:** 80%+ coverage

---

#### 1.2 Accessibility (2 days)

**File to Change:** `src/components/ui/Button/Button.tsx`

**Quick Fix:**
```typescript
// Before: <div className={...} onClick={...}>
// After:  <button type="button" className={...} onClick={...}>
```

**Add Props:**
- `type?: 'button' | 'submit' | 'reset'`
- `disabled?: boolean`
- `ariaLabel?: string`

**Goal:** Semantic HTML + Keyboard support

---

### Phase 2: High Priority (Week 3-4)

#### 2.1 Dependency Inversion (5 days)

**Create these files:**
```
src/lib/api/interfaces/IApiClient.ts
src/lib/api/adapters/AxiosApiClient.ts
src/lib/api/factory/apiClientFactory.ts
src/features/form/repositories/IFormRepository.ts
src/features/form/repositories/FormRepository.ts
```

**Copy implementations from:** `MIGRATION_GUIDE.md` Section 2.1

**Goal:** Abstract API dependencies

---

#### 2.2 Error Handling (4 days)

**Create these files:**
```
src/lib/errors/AppError.ts
src/lib/errors/ErrorLogger.ts
src/components/errors/ErrorBoundary.tsx
src/components/errors/ErrorFallback.tsx
src/hooks/useErrorHandler.ts
```

**Update:** `src/main.tsx` to wrap with ErrorBoundary

**Goal:** Centralized error handling

---

#### 2.3 API Standardization (2 days)

**Find all axios imports:**
```bash
grep -r "import axios" src/ --include="*.ts" --include="*.tsx"
```

**Replace with:** Centralized `apiClient` from factory

**Create:** `src/config/apiEndpoints.ts` for constants

**Goal:** Consistent API usage

---

### Phase 3: Quality Enhancements (Week 5-6)

#### 3.1 Interface Segregation (3 days)

**Split FormField interface into:**
- `BaseFieldProperties`
- `FieldDisplay`
- `FieldValidation`
- `FieldConfiguration`
- `FieldMetadata`

**Location:** `src/types/form/`

**Goal:** Smaller, focused interfaces

---

#### 3.2 Documentation (3 days)

**Add JSDoc comments to:**
- All validators
- All operators
- All transformers
- Public APIs

**Create:**
- `docs/API.md`
- JSDoc examples
- Type guards in `src/utils/typeGuards.ts`

**Goal:** Self-documenting code

---

## Daily Workflow

### Morning (30 min)
1. Pull latest changes
2. Review `MIGRATION_CHECKLIST.md`
3. Choose 1-2 tasks for the day
4. Update checklist with current score

### During Work (6-8 hours)
1. Implement changes following `MIGRATION_GUIDE.md`
2. Write tests for your changes
3. Run `./scripts/verify-migration.sh`
4. Fix any issues found

### End of Day (30 min)
1. Run verification script
2. Commit your changes
3. Update `MIGRATION_CHECKLIST.md`
4. Push to feature branch

### Weekly
1. Tag stable checkpoint
2. Team review
3. Update score tracking
4. Plan next week's tasks

---

## Commands Cheat Sheet

```bash
# Install dependencies
pnpm add -D vitest @vitest/ui @testing-library/react

# Run tests
pnpm test              # Interactive mode
pnpm test:coverage     # With coverage
pnpm test:ui          # Visual UI

# Run quality checks
pnpm lint             # ESLint
pnpm tsc --noEmit     # Type check

# Verify migration
./scripts/verify-migration.sh

# Git workflow
git checkout -b feature/phase-1-testing
git commit -m "feat: add testing infrastructure"
git push origin feature/phase-1-testing
```

---

## Testing Strategy

### Unit Tests Priority Order

1. **Core validators** (Highest value)
   - `emailValidator.test.ts`
   - `requiredValidator.test.ts`
   - `createCustomValidator.test.ts`

2. **Registries** (High value)
   - `validatorRegistry.test.ts`
   - `operatorRegistry.test.ts`
   - `transformerRegistry.test.ts`
   - `fieldRegistry.test.ts`

3. **UI Components** (Medium value)
   - `Button.test.tsx`
   - `Error.test.tsx`
   - `Loading.test.tsx`

4. **Hooks** (Medium value)
   - `useFormState.test.ts`
   - `useFormSubmit.test.ts`

5. **Utils** (Lower priority)
   - `phoneUtils.test.ts`
   - `transformFormData.test.ts`

---

## Common Issues & Solutions

### Issue: Tests failing with module resolution errors

**Solution:**
```typescript
// In vitest.config.ts, add resolve.alias matching tsconfig paths
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    // ... other aliases
  }
}
```

---

### Issue: Button click not working after changing to <button>

**Solution:**
```css
/* Add to Button.module.css */
.buttonContainer {
  background: inherit;
  border: none;
  font: inherit;
  cursor: pointer;
}
```

---

### Issue: Error boundary not catching errors

**Solution:**
```typescript
// Error boundaries only catch errors in:
// 1. Render methods
// 2. Lifecycle methods
// 3. Constructors

// For async errors, use try-catch + errorLogger manually
```

---

### Issue: Coverage not reaching 80%

**Strategy:**
1. Run `pnpm test:coverage`
2. Open `coverage/index.html`
3. Identify untested files
4. Prioritize core business logic
5. Skip trivial getters/setters

---

## Success Indicators

After each phase, you should see:

**Phase 1:**
- ✅ `pnpm test` passes
- ✅ Coverage report shows 80%+
- ✅ Button works with keyboard
- 📊 Score: ~8.5/10

**Phase 2:**
- ✅ No direct axios imports in features
- ✅ ErrorBoundary catches all errors
- ✅ No console.warn/log in code
- 📊 Score: ~9.5/10

**Phase 3:**
- ✅ All interfaces properly segregated
- ✅ JSDoc on all public APIs
- ✅ API documentation complete
- 📊 Score: 10/10 🎉

---

## Getting Help

### Resources
- **Main Guide:** `MIGRATION_GUIDE.md` (Detailed steps)
- **Checklist:** `MIGRATION_CHECKLIST.md` (Track progress)
- **This File:** Quick reference & commands

### Documentation Links
- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Team Communication
- Tag questions with `#migration`
- Use `MIGRATION_CHECKLIST.md` for status
- Weekly sync meetings

---

## Minimal Viable Migration (1 Week)

If you have **only 1 week**, do this:

**Day 1-2:** Testing Setup
- Install Vitest
- Configure vitest.config.ts
- Write 5 core tests (validators + registries)

**Day 3:** Button Accessibility
- Fix Button component
- Add keyboard support
- Write accessibility test

**Day 4:** Error Handling
- Create AppError class
- Create ErrorBoundary
- Wrap app in ErrorBoundary

**Day 5:** Verification
- Run `./scripts/verify-migration.sh`
- Fix any critical issues
- Document what's left

**Result:** Score ~8.5/10 (Critical issues resolved)

---

## Remember

1. **Commit often** - Tag after each phase
2. **Test everything** - Don't skip tests
3. **Ask questions** - Better than wrong assumptions
4. **Document changes** - Help future developers
5. **Celebrate wins** - Each phase is progress! 🎉

---

**Ready to start?**

1. Read this file ✅
2. Run `./scripts/verify-migration.sh`
3. Open `MIGRATION_GUIDE.md`
4. Check off items in `MIGRATION_CHECKLIST.md`
5. Start with Phase 1.1! 🚀

Good luck! You've got this! 💪
