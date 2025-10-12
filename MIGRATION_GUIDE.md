# Step-by-Step Migration Guide

## Overview

This guide provides detailed, actionable steps to migrate the **vecnas-curse** project from its current structure to the recommended feature-based architecture. The migration is organized into 4 phases to minimize risk and ensure a smooth transition.

**Estimated Total Time**: 8-12 hours (spread across multiple sessions)

---

## Pre-Migration Checklist

Before starting the migration, ensure:

-   [ ] All current work is committed to Git
-   [ ] Create a new branch: `git checkout -b refactor/folder-structure`
-   [ ] Backup the current codebase
-   [ ] All tests are passing (if applicable)
-   [ ] Team members are informed about the migration
-   [ ] You have a rollback plan (the Git branch)

---

## Phase 1: Foundation Setup (2-3 hours)

**Goal**: Create new directories and configure tooling without breaking existing code.

**Risk Level**: Low

### Step 1.1: Create New Directory Structure

```bash
# Navigate to project root
cd /home/aswinasok/Desktop/vecnas-curse

# Create new directories
mkdir -p src/types
mkdir -p src/config
mkdir -p src/lib/axios
mkdir -p src/lib/react-query
mkdir -p src/lib/validations/schemas
mkdir -p src/hooks
mkdir -p src/core/business-rules
mkdir -p src/core/operators
mkdir -p src/core/transformers
mkdir -p src/core/validators
mkdir -p src/features
mkdir -p src/styles
mkdir -p src/app/providers
mkdir -p src/app/routes

# Create organized public assets structure
mkdir -p public/images/logos
mkdir -p public/images/icons
mkdir -p public/fonts
```

### Step 1.2: Move Public Assets

```bash
# Move existing logo files
mv public/turnupblack.png public/images/logos/turnup-black.png
mv public/turnuplogo.png public/images/logos/turnup-logo.png
```

**Update references**: Search for `turnupblack.png` and `turnuplogo.png` in your codebase and update paths:

```typescript
// Before
<img src="/turnuplogo.png" />

// After
<img src="/images/logos/turnup-logo.png" />
```

### Step 1.3: Setup Path Aliases

**Update `tsconfig.json`**:

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"],
            "@/components/*": ["src/components/*"],
            "@/features/*": ["src/features/*"],
            "@/hooks/*": ["src/hooks/*"],
            "@/utils/*": ["src/utils/*"],
            "@/types/*": ["src/types/*"],
            "@/config/*": ["src/config/*"],
            "@/lib/*": ["src/lib/*"],
            "@/core/*": ["src/core/*"],
            "@/styles/*": ["src/styles/*"],
            "@/app/*": ["src/app/*"]
        }
    }
}
```

**Update `vite.config.ts`**:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
```

**Install path package** (if not already installed):

```bash
npm install -D @types/node
```

### Step 1.4: Create Global Type Files

**Create `src/types/index.ts`**:

```typescript
// Re-export all types from this barrel file
export * from "./api.types";
export * from "./common.types";
```

**Create `src/types/common.types.ts`**:

```typescript
// Common types used across the application
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ID = string | number;

// Add other common types as needed
```

**Create `src/types/api.types.ts`**:

```typescript
// API-related types
export interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ApiError {
    message: string;
    code?: string;
    details?: unknown;
}
```

### Step 1.5: Move and Consolidate Existing Types

**Examine `src/services/types.ts`**:

```bash
# View the current types file
cat src/services/types.ts
```

**Move types to appropriate locations**:

```bash
# Copy the file to review
cp src/services/types.ts src/types/api.types.ts
```

Then manually organize types into:

-   `src/types/api.types.ts` - API response types
-   `src/types/event.types.ts` - Event-related types (to be created later in feature folders)
-   `src/types/form.types.ts` - Form-related types (to be created later in feature folders)

### Step 1.6: Create Configuration Files

**Create `src/config/env.ts`**:

```typescript
export const env = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "https://api.makemypass.com",
    isProd: import.meta.env.PROD,
    isDev: import.meta.env.DEV,
    mode: import.meta.env.MODE,
} as const;

// Type for environment variables
export type Env = typeof env;
```

**Create `src/config/constants.ts`**:

```typescript
export const APP_CONSTANTS = {
    APP_NAME: "Vecnas Curse",
    DEFAULT_PAGE_SIZE: 10,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif"],
} as const;

// Add other constants as needed
```

**Create `src/config/index.ts`**:

```typescript
export * from "./env";
export * from "./constants";
```

### Step 1.7: Setup Axios Client

**Create `src/lib/axios/client.ts`**:

```typescript
import axios from "axios";
import { env } from "@/config";

export const apiClient = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});
```

**Create `src/lib/axios/interceptors.ts`**:

```typescript
import { apiClient } from "./client";
import type { AxiosError, AxiosResponse } from "axios";

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Handle unauthorized
            console.error("Unauthorized access");
        }
        return Promise.reject(error);
    }
);
```

**Create `src/lib/axios/index.ts`**:

```typescript
export { apiClient } from "./client";
export * from "./interceptors";
```

### Step 1.8: Move Global Styles

```bash
# Move index.css to styles directory
mv src/index.css src/styles/index.css
```

**Update import in `src/main.tsx`**:

```typescript
// Before
import "./index.css";

// After
import "@/styles/index.css";
```

### Step 1.9: Test Phase 1

```bash
# Run the build to ensure nothing is broken
npm run build

# If using a dev server, start it
npm run dev
```

**Commit Phase 1**:

```bash
git add .
git commit -m "refactor(structure): Phase 1 - Foundation setup

- Created new directory structure (types, config, lib, core, features)
- Setup path aliases in tsconfig and vite.config
- Moved public assets to organized structure
- Created configuration files (env.ts, constants.ts)
- Setup axios client with interceptors
- Moved global styles to styles directory
- Created type files structure"
```

---

## Phase 2: Feature Migration (4-6 hours)

**Goal**: Migrate page components to feature-based structure.

**Risk Level**: Medium

### Step 2.1: Migrate Core Business Logic

#### 2.1.1: Move Business Rules

```bash
# Move business rules directory
mv src/utils/businessRules src/core/business-rules/rules

# Remove duplicate flat file (after confirming content is in directory)
# Review the file first
cat src/utils/businessRules.ts

# If it's just re-exports, delete it
rm src/utils/businessRules.ts

# If it contains unique logic, integrate it into the new structure
```

**Create `src/core/business-rules/index.ts`**:

```typescript
// Export business rules engine and registry
export * from "./rules";
export * from "./engine";
export * from "./registry";
```

#### 2.1.2: Move Operators

```bash
# Move operators
mv src/utils/operators src/core/operators/registry
```

**Create `src/core/operators/index.ts`**:

```typescript
export * from "./registry";
```

#### 2.1.3: Move Transformers (Fix Typo)

```bash
# Move and rename transformers
mv src/utils/transfomers src/core/transformers/registry
```

**Create `src/core/transformers/index.ts`**:

```typescript
export * from "./registry";
```

#### 2.1.4: Move Validators

```bash
# Move validation logic
mv src/utils/validation src/core/validators/registry
```

**Create `src/core/validators/index.ts`**:

```typescript
export * from "./registry";
```

### Step 2.2: Migrate Event Feature

#### 2.2.1: Create Event Feature Structure

```bash
# Create event feature directories
mkdir -p src/features/event/api
mkdir -p src/features/event/components
mkdir -p src/features/event/hooks
mkdir -p src/features/event/types
```

#### 2.2.2: Move Event Components

```bash
# Move EventPage
mv src/components/EventPage src/features/event/components/EventPage

# Move About component (if it's event-specific)
mv src/components/About src/features/event/components/About
```

#### 2.2.3: Create Event API

**Create `src/features/event/api/eventInfoApi.ts`**:

Move the event API logic from `src/services/apis/` to this new file:

```typescript
import { apiClient } from "@/lib/axios";
import type { EventInfo } from "../types/event.types";

export const getEventInfo = async (eventSlug: string): Promise<EventInfo> => {
    const response = await apiClient.get(`/makemypass/public-form/${eventSlug}/info/`);
    return response.data;
};
```

#### 2.2.4: Create Event Types

**Create `src/features/event/types/event.types.ts`**:

Move event-related types from `src/services/types.ts`:

```typescript
// Define event-specific types here
export interface EventInfo {
    // Add fields from your existing types
    id: string;
    name: string;
    slug: string;
    // ... other fields
}
```

#### 2.2.5: Create Event Hooks

**Check if EventPage has hooks**:

```bash
# Check for hooks in EventPage
ls src/features/event/components/EventPage/hooks/
```

If hooks exist:

```bash
# Move hooks to feature-level
mv src/features/event/components/EventPage/hooks/* src/features/event/hooks/
rmdir src/features/event/components/EventPage/hooks
```

#### 2.2.6: Create Event Page Entry Point

**Create `src/features/event/EventPage.tsx`**:

```typescript
// Main event page component
export { default } from "./components/EventPage";
```

#### 2.2.7: Create Event Barrel Export

**Create `src/features/event/index.ts`**:

```typescript
export { default as EventPage } from "./EventPage";
export * from "./types/event.types";
```

### Step 2.3: Migrate Form Feature

#### 2.3.1: Create Form Feature Structure

```bash
# Create form feature directories
mkdir -p src/features/form/api
mkdir -p src/features/form/components/fields
mkdir -p src/features/form/contexts
mkdir -p src/features/form/hooks
mkdir -p src/features/form/services
mkdir -p src/features/form/types
mkdir -p src/features/form/utils
```

#### 2.3.2: Move Form Components

```bash
# Move FormPage
mv src/components/FormPage/components src/features/form/components/
```

**Organize form fields**:

```bash
# If you have individual field components, organize them
# Example:
# mv src/features/form/components/PhoneField.tsx src/features/form/components/fields/
# mv src/features/form/components/RadioField.tsx src/features/form/components/fields/
```

#### 2.3.3: Move Form Hooks

```bash
# Move all form hooks
mv src/components/FormPage/hooks/* src/features/form/hooks/
```

#### 2.3.4: Move Form Services

```bash
# Move form services
mv src/components/FormPage/services/* src/features/form/services/
```

#### 2.3.5: Move Form Contexts

```bash
# Move contexts from root level to form feature
mv src/contexts/eventDataContext.ts src/features/form/contexts/
mv src/contexts/paginationContext.ts src/features/form/contexts/
```

**Update context exports** - Create `src/features/form/contexts/index.ts`:

```typescript
export * from "./eventDataContext";
export * from "./paginationContext";
```

#### 2.3.6: Move Form-Specific Utils

```bash
# Move form-specific utilities
mv src/utils/prepareLogData.ts src/features/form/utils/
mv src/utils/prepareSubmitData.ts src/features/form/utils/
mv src/utils/ticketMapping.ts src/features/form/utils/
mv src/utils/formDataTransformers.ts src/features/form/utils/
mv src/utils/fieldConditions.ts src/features/form/utils/
```

**Create utils barrel export** - `src/features/form/utils/index.ts`:

```typescript
export * from "./prepareLogData";
export * from "./prepareSubmitData";
export * from "./ticketMapping";
export * from "./formDataTransformers";
export * from "./fieldConditions";
```

#### 2.3.7: Move Form Data

```bash
# Move form data if it exists
mv src/components/FormPage/data src/features/form/data
```

#### 2.3.8: Create Form API Files

**Create `src/features/form/api/formLogApi.ts`**:

```typescript
import { apiClient } from "@/lib/axios";

export const logFormAction = async (logData: unknown) => {
    const response = await apiClient.post("/form-log/", logData);
    return response.data;
};
```

**Create `src/features/form/api/formSubmissionApi.ts`**:

```typescript
import { apiClient } from "@/lib/axios";

export const submitForm = async (formData: unknown) => {
    const response = await apiClient.post("/form-submission/", formData);
    return response.data;
};
```

**Create `src/features/form/api/index.ts`**:

```typescript
export * from "./formLogApi";
export * from "./formSubmissionApi";
```

#### 2.3.9: Create Form Types

**Create `src/features/form/types/form.types.ts`**:

Move form-related types from existing locations:

```typescript
export interface FormField {
    id: string;
    name: string;
    type: string;
    required: boolean;
    // ... other fields
}

export interface FormData {
    // Define form data structure
}

export interface FormSubmission {
    // Define submission structure
}
```

#### 2.3.10: Create Form Page Entry Point

**Create `src/features/form/FormPage.tsx`**:

```typescript
// Main form page component
// Move or reference the existing FormPage component logic here
export { default } from "./components/FormPage";
```

#### 2.3.11: Create Form Barrel Export

**Create `src/features/form/index.ts`**:

```typescript
export { default as FormPage } from "./FormPage";
export * from "./types/form.types";
export * from "./contexts";
export * from "./hooks";
```

### Step 2.4: Migrate Success Feature

#### 2.4.1: Create Success Feature

```bash
# Create success feature directory
mkdir -p src/features/success
```

#### 2.4.2: Move Success Page

```bash
# Move SuccessPage
mv src/components/SuccessPage src/features/success/
```

#### 2.4.3: Create Success Entry Point

**Create `src/features/success/index.ts`**:

```typescript
export { default as SuccessPage } from "./SuccessPage";
```

### Step 2.5: Reorganize Shared Components

#### 2.5.1: Create Layouts Directory

```bash
# Create layouts structure
mkdir -p src/components/layouts/Footer
mkdir -p src/components/layouts/MainLayout
```

#### 2.5.2: Move Layout Components

```bash
# Move Footer
mv src/components/Footer/* src/components/layouts/Footer/
rmdir src/components/Footer
```

#### 2.5.3: Organize SEO Component

```bash
# Create SEO directory
mkdir -p src/components/seo

# Move SEO component
mv src/components/SEO/* src/components/seo/
rmdir src/components/SEO
```

#### 2.5.4: Organize UI Components

The `src/components/ui` directory should already exist. Ensure all generic UI components are here:

```bash
# List UI components
ls src/components/ui/
```

**Create barrel export** - `src/components/ui/index.ts`:

```typescript
// Export all UI components
export * from "./Button";
export * from "./Input";
export * from "./Select";
// ... add others as needed
```

### Step 2.6: Update All Import Paths

This is the most time-consuming step. You need to update imports throughout the codebase.

#### 2.6.1: Find and Replace Strategy

**Use your IDE's find-and-replace** or use these bash commands:

```bash
# Find all TypeScript/TSX files
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec echo {} \;

# For each file, you'll need to update imports
# Example: Update context imports
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|from.*contexts/eventDataContext|from "@/features/form/contexts"|g' {} \;
```

**Manual approach** (recommended for accuracy):

1. Start your development server: `npm run dev`
2. Open your code editor with TypeScript error checking
3. Look for import errors (red squiggly lines)
4. Update imports one by one using the new paths

**Common replacements**:

```typescript
// Event imports
import { EventInfo } from "../services/types";
// becomes
import { EventInfo } from "@/features/event/types/event.types";

// Form contexts
import { EventDataContext } from "../../contexts/eventDataContext";
// becomes
import { EventDataContext } from "@/features/form/contexts";

// Form hooks
import { usePagination } from "./hooks/usePagination.hook";
// becomes
import { usePagination } from "@/features/form/hooks/usePagination.hook";

// Core business rules
import { evaluateRule } from "../../utils/businessRules";
// becomes
import { evaluateRule } from "@/core/business-rules";

// Utils
import { phoneUtils } from "../../utils/phoneUtils";
// becomes
import { phoneUtils } from "@/utils/phoneUtils";

// API client
import axios from "axios";
// becomes
import { apiClient } from "@/lib/axios";
```

### Step 2.7: Update Route Configuration

If you have route definitions, update them:

**Create `src/app/routes/index.tsx`**:

```typescript
import { EventPage } from "@/features/event";
import { FormPage } from "@/features/form";
import { SuccessPage } from "@/features/success";

export const routes = [
    {
        path: "/",
        element: <EventPage />,
    },
    {
        path: "/form",
        element: <FormPage />,
    },
    {
        path: "/success",
        element: <SuccessPage />,
    },
];
```

### Step 2.8: Clean Up Old Directories

**Only after everything works**, remove old empty directories:

```bash
# Check if directories are empty before removing
ls src/components/EventPage  # Should be empty or not exist
ls src/components/FormPage   # Should be empty or not exist

# Remove empty directories
rm -rf src/components/EventPage
rm -rf src/components/FormPage
rm -rf src/contexts

# Clean up old services directory structure
# Review first, then remove
ls src/services/apis/
# If empty:
rm -rf src/services
```

### Step 2.9: Update Remaining Utils

Keep only shared utilities in `src/utils/`:

```bash
# What should remain in utils:
ls src/utils/

# Expected files:
# - phoneUtils.ts (if used across features)
# - helpers.ts (general helpers)
# - formatters.ts (if exists)
```

### Step 2.10: Test Phase 2

```bash
# Run TypeScript compiler
npx tsc --noEmit

# Run build
npm run build

# Start dev server and test all routes
npm run dev

# Test each feature:
# 1. Navigate to event page
# 2. Navigate to form page
# 3. Test form submission
# 4. Check success page
```

**Commit Phase 2**:

```bash
git add .
git commit -m "refactor(structure): Phase 2 - Feature migration

- Migrated core business logic to src/core/
- Created event feature module with components, hooks, types, and API
- Created form feature module with full colocation
- Created success feature module
- Reorganized shared components (layouts, seo, ui)
- Moved contexts into form feature
- Updated all import paths to use new structure
- Cleaned up old directory structure"
```

---

## Phase 3: Refinement (1-2 hours)

**Goal**: Add barrel exports and optimize imports.

**Risk Level**: Low

### Step 3.1: Create Comprehensive Barrel Exports

#### 3.1.1: Components Barrel Exports

**Create `src/components/layouts/index.ts`**:

```typescript
export * from "./Footer";
export * from "./MainLayout";
```

**Create `src/components/seo/index.ts`**:

```typescript
export * from "./SEO";
```

**Create `src/components/index.ts`**:

```typescript
export * from "./layouts";
export * from "./seo";
export * from "./ui";
```

#### 3.1.2: Hooks Barrel Export

**Create `src/hooks/index.ts`**:

```typescript
// Export all shared hooks
export * from "./useDebouncedEffect";
export * from "./useLocalStorage";
// Add others as needed
```

#### 3.1.3: Utils Barrel Export

**Create `src/utils/index.ts`**:

```typescript
export * from "./phoneUtils";
export * from "./fieldConditions";
export * from "./formDataTransformers";
export * from "./helpers";
```

#### 3.1.4: Core Barrel Exports

**Create `src/core/index.ts`**:

```typescript
export * from "./business-rules";
export * from "./operators";
export * from "./transformers";
export * from "./validators";
```

### Step 3.2: Optimize Imports

Update imports to use barrel exports:

```typescript
// Before
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { Footer } from "@/components/layouts/Footer/Footer";

// After
import { Button, Input } from "@/components/ui";
import { Footer } from "@/components/layouts";
```

### Step 3.3: Add Index Files to Feature Subdirectories

**Example for form fields**:

**Create `src/features/form/components/fields/index.ts`**:

```typescript
export * from "./PhoneField";
export * from "./RadioField";
export * from "./TextAreaField";
export * from "./BaseFieldWrapper";
```

Then update imports:

```typescript
// Before
import { PhoneField } from "./fields/PhoneField";
import { RadioField } from "./fields/RadioField";

// After
import { PhoneField, RadioField } from "./fields";
```

### Step 3.4: Create Documentation Files

**Create `src/features/README.md`**:

```markdown
# Features Directory

This directory contains feature-based modules. Each feature is self-contained with its own:

-   Components
-   Hooks
-   API calls
-   Types
-   Utils
-   Contexts (if needed)

## Current Features

-   **event**: Event information and display
-   **form**: Form rendering, validation, and submission
-   **success**: Success page after form submission

## Adding a New Feature

1. Create a new directory: `src/features/your-feature/`
2. Add subdirectories: `api/`, `components/`, `hooks/`, `types/`
3. Create feature entry point: `YourFeature.tsx`
4. Export from `index.ts`
```

**Create `src/core/README.md`**:

```markdown
# Core Directory

This directory contains framework-agnostic business logic:

-   **business-rules**: Business rules engine
-   **operators**: Custom operators for rule evaluation
-   **transformers**: Data transformation logic
-   **validators**: Validation logic

This code should be pure TypeScript with no React dependencies.
```

### Step 3.5: Test Phase 3

```bash
# Run build
npm run build

# Check bundle size
du -sh dist/

# Verify dev server
npm run dev
```

**Commit Phase 3**:

```bash
git add .
git commit -m "refactor(structure): Phase 3 - Refinement

- Added barrel exports for all directories
- Optimized imports using barrel exports
- Added documentation files for features and core
- Improved code organization and discoverability"
```

---

## Phase 4: Optimization (Optional, 2-3 hours)

**Goal**: Optimize performance and developer experience.

**Risk Level**: Low

### Step 4.1: Setup ESLint Rules

**Install plugins**:

```bash
npm install -D eslint-plugin-import eslint-plugin-simple-import-sort eslint-plugin-unused-imports
```

**Update `.eslintrc.cjs` or `eslint.config.js`**:

```javascript
module.exports = {
    plugins: ["import", "simple-import-sort", "unused-imports"],
    rules: {
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-duplicates": "error",
        "unused-imports/no-unused-imports": "error",
    },
};
```

**Run ESLint fix**:

```bash
npm run lint -- --fix
```

### Step 4.2: Analyze Bundle Size

**Install bundle analyzer**:

```bash
npm install -D rollup-plugin-visualizer
```

**Update `vite.config.ts`**:

```typescript
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
    plugins: [
        react(),
        visualizer({
            open: true,
            gzipSize: true,
            brotliSize: true,
        }),
    ],
});
```

**Build and analyze**:

```bash
npm run build
# Opens visualization in browser
```

### Step 4.3: Implement Code Splitting

**Update route configuration** for lazy loading:

```typescript
import { lazy, Suspense } from "react";

const EventPage = lazy(() => import("@/features/event"));
const FormPage = lazy(() => import("@/features/form"));
const SuccessPage = lazy(() => import("@/features/success"));

export const routes = [
    {
        path: "/",
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <EventPage />
            </Suspense>
        ),
    },
    // ... other routes
];
```

### Step 4.4: Add Pre-commit Hooks

**Install husky and lint-staged**:

```bash
npm install -D husky lint-staged
npx husky install
```

**Add to `package.json`**:

```json
{
    "lint-staged": {
        "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
    }
}
```

**Create pre-commit hook**:

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

### Step 4.5: Document Changes

**Update main `README.md`**:

```markdown
## Project Structure

This project follows a feature-based architecture:
```

src/
├── features/ # Feature modules (event, form, success)
├── components/ # Shared components (layouts, ui, seo)
├── core/ # Business logic (framework-agnostic)
├── lib/ # Third-party integrations
├── hooks/ # Shared hooks
├── utils/ # Utility functions
├── types/ # Global type definitions
├── config/ # Configuration files
└── styles/ # Global styles

```

See [FOLDER_STRUCTURE.md](./folderStruct.md) for detailed documentation.
```

### Step 4.6: Final Testing

```bash
# Run all checks
npm run lint
npm run build
npm run dev

# Test all features thoroughly
# - Event page loads correctly
# - Form submission works
# - Success page displays
# - No console errors
# - Navigation works
```

**Commit Phase 4**:

```bash
git add .
git commit -m "refactor(structure): Phase 4 - Optimization

- Added ESLint rules for import organization
- Implemented bundle size analysis
- Added code splitting for routes
- Setup pre-commit hooks with husky
- Updated documentation"
```

---

## Post-Migration Tasks

### 1. Merge and Deploy

```bash
# Merge feature branch
git checkout main
git merge refactor/folder-structure

# Push to remote
git push origin main
```

### 2. Team Communication

-   Share this migration guide with the team
-   Conduct a code walkthrough session
-   Update team documentation
-   Add architecture diagram

### 3. Monitoring

-   Monitor build times before and after
-   Check bundle sizes
-   Gather team feedback
-   Track developer productivity

---

## Rollback Plan

If something goes wrong:

```bash
# Rollback to previous state
git checkout main
git reset --hard <commit-before-migration>

# Or if on feature branch
git checkout main
git branch -D refactor/folder-structure
```

---

## Troubleshooting

### Issue: Import Errors

**Problem**: TypeScript shows import errors after migration.

**Solution**:

```bash
# Clear TypeScript cache
rm -rf node_modules/.vite
rm -rf dist

# Reinstall dependencies
npm install

# Restart TypeScript server in your IDE
```

### Issue: Build Fails

**Problem**: `npm run build` fails with module not found errors.

**Solution**:

-   Check that all path aliases are correctly set in both `tsconfig.json` and `vite.config.ts`
-   Verify that all import paths have been updated
-   Use TypeScript compiler to find issues: `npx tsc --noEmit`

### Issue: Runtime Errors

**Problem**: App runs but crashes at runtime.

**Solution**:

-   Check browser console for specific errors
-   Verify that all dynamic imports are wrapped in Suspense (if using lazy loading)
-   Check that context providers are still wrapping components correctly

### Issue: Slow Build Times

**Problem**: Build times increased after migration.

**Solution**:

-   Check for circular dependencies using a tool like `madge`
-   Ensure barrel exports don't re-export too much
-   Consider selective exports instead of `export *`

---

## Verification Checklist

After completing the migration, verify:

-   [ ] All pages load without errors
-   [ ] Form submission works correctly
-   [ ] All API calls succeed
-   [ ] TypeScript compilation succeeds
-   [ ] Build completes successfully
-   [ ] No console errors in browser
-   [ ] All tests pass (if applicable)
-   [ ] Bundle size is reasonable
-   [ ] Hot module replacement works in dev mode
-   [ ] Production build works correctly
-   [ ] All imports use path aliases
-   [ ] No duplicate code exists
-   [ ] Documentation is updated
-   [ ] Team is informed

---

## Timeline Estimate

| Phase     | Tasks             | Estimated Time | Risk Level |
| --------- | ----------------- | -------------- | ---------- |
| Phase 1   | Foundation setup  | 2-3 hours      | Low        |
| Phase 2   | Feature migration | 4-6 hours      | Medium     |
| Phase 3   | Refinement        | 1-2 hours      | Low        |
| Phase 4   | Optimization      | 2-3 hours      | Low        |
| **Total** |                   | **9-14 hours** |            |

Spread this work across multiple days for best results.

---

## Success Metrics

After migration, you should see improvements in:

1. **Developer Experience**

    - Faster file location
    - Clearer code organization
    - Easier onboarding

2. **Code Quality**

    - Reduced coupling between features
    - Better separation of concerns
    - More testable code

3. **Maintainability**

    - Easier to add new features
    - Simpler refactoring
    - Better code reuse

4. **Performance**
    - Optimized bundle sizes
    - Better tree-shaking
    - Efficient code splitting

---

## Next Steps

1. Start with Phase 1 during a low-activity period
2. Test thoroughly after each phase
3. Commit frequently with descriptive messages
4. Get team review after Phase 2
5. Deploy to staging environment for testing
6. Monitor for any issues
7. Deploy to production

---

## Additional Resources

-   [React Folder Structure Best Practices](https://react.dev/learn/thinking-in-react)
-   [Feature-Sliced Design](https://feature-sliced.design/)
-   [Bulletproof React](https://github.com/alan2207/bulletproof-react)
-   [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

---

## Questions or Issues?

If you encounter issues during migration:

1. Review this guide thoroughly
2. Check the troubleshooting section
3. Consult with team members
4. Create a rollback plan if needed
5. Document any new issues for future reference

Good luck with the migration!
