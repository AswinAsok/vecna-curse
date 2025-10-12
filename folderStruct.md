# Folder Structure Improvement Recommendations

## Executive Summary

This document analyzes the current folder structure of the **vecnas-curse** project and provides comprehensive recommendations to align with industry-standard practices for React + Vite + TypeScript applications. The goal is to improve maintainability, scalability, developer experience, and code organization.

---

## Current Structure Analysis

### Current Directory Tree

```
src/
├── components/
│   ├── About/
│   ├── EventPage/
│   │   ├── components/
│   │   └── hooks/
│   ├── Footer/
│   ├── FormPage/
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   └── services/
│   ├── SEO/
│   ├── SuccessPage/
│   └── ui/
├── contexts/
│   ├── eventDataContext.ts
│   └── paginationContext.ts
├── services/
│   ├── apis/
│   └── types.ts
├── utils/
│   ├── businessRules/
│   ├── operators/
│   ├── transfomers/
│   ├── validation/
│   ├── businessRules.ts
│   ├── fieldConditions.ts
│   ├── formDataTransformers.ts
│   ├── phoneUtils.ts
│   ├── prepareLogData.ts
│   ├── prepareSubmitData.ts
│   └── ticketMapping.ts
├── index.css
└── main.tsx
```

### Identified Issues

1. **Inconsistent Component Organization**: Page components (EventPage, FormPage, SuccessPage) are mixed with UI components in the same directory level
2. **Mixed Colocation Strategy**: Some components have colocated hooks/services (FormPage), others don't
3. **Unclear Separation of Concerns**: utils directory has both flat files and organized subdirectories
4. **No Type Centralization**: Type definitions are scattered across services and components
5. **Missing Standard Directories**: No dedicated directories for hooks, lib, config, constants, or assets
6. **Context Placement**: Contexts are at root level but serve specific features
7. **Duplicate Files**: utils has both `businessRules.ts` (flat) and `businessRules/` (directory)
8. **No API Client Abstraction**: API services are basic without proper client setup
9. **Public Assets**: Images in public/ should potentially be organized better

---

## Recommended Structure

### Feature-Based Structure

This approach organizes code by features/domains, promoting modularity and team scalability. It's the industry-standard approach for React applications that need to scale.

```
src/
├── app/                          # Application-level code
│   ├── providers/                # App providers (Query, Router, Theme, etc.)
│   │   ├── AppProviders.tsx
│   │   └── QueryProvider.tsx
│   ├── routes/                   # Route definitions
│   │   ├── index.tsx
│   │   └── router.tsx
│   └── App.tsx                   # Root app component
│
├── features/                     # Feature-based modules
│   ├── event/                    # Event feature
│   │   ├── api/                  # Event-specific API calls
│   │   │   └── eventInfoApi.ts
│   │   ├── components/           # Event-specific components
│   │   │   ├── EventPageLayout.tsx
│   │   │   └── About.tsx
│   │   ├── hooks/                # Event-specific hooks
│   │   │   └── useEventInfo.ts
│   │   ├── types/                # Event-specific types
│   │   │   └── event.types.ts
│   │   └── EventPage.tsx         # Main event page
│   │
│   ├── form/                     # Form feature
│   │   ├── api/                  # Form-specific API calls
│   │   │   ├── formLogApi.ts
│   │   │   └── formSubmissionApi.ts
│   │   ├── components/           # Form-specific components
│   │   │   ├── fields/           # Form field components
│   │   │   │   ├── PhoneField.tsx
│   │   │   │   ├── RadioField.tsx
│   │   │   │   ├── TextAreaField.tsx
│   │   │   │   ├── BaseFieldWrapper.tsx
│   │   │   │   └── fieldRegistry.ts
│   │   │   ├── FormFieldsRenderer.tsx
│   │   │   └── FormPaginationLayout.tsx
│   │   ├── contexts/             # Form-specific contexts
│   │   │   ├── eventDataContext.ts
│   │   │   └── paginationContext.ts
│   │   ├── hooks/                # Form-specific hooks
│   │   │   ├── usePagination.hook.ts
│   │   │   ├── useFormState.ts
│   │   │   ├── useFormSubmit.ts
│   │   │   ├── useSubmissionState.ts
│   │   │   ├── useFormLogUpdation.hook.ts
│   │   │   ├── useFormSubmission.hook.ts
│   │   │   ├── useDebouncedEffect.ts
│   │   │   ├── useFormErrorHandler.ts
│   │   │   └── useFormValidation.hook.ts
│   │   ├── services/             # Form business logic
│   │   │   └── function.ts
│   │   ├── types/                # Form-specific types
│   │   │   └── form.types.ts
│   │   ├── utils/                # Form-specific utilities
│   │   │   ├── prepareLogData.ts
│   │   │   ├── prepareSubmitData.ts
│   │   │   └── ticketMapping.ts
│   │   └── FormPage.tsx          # Main form page
│   │
│   └── success/                  # Success page feature
│       └── SuccessPage.tsx
│
├── components/                   # Shared/reusable components
│   ├── layouts/                  # Layout components
│   │   ├── Footer/
│   │   │   └── Footer.tsx
│   │   └── MainLayout/
│   │       └── MainLayout.tsx
│   ├── seo/                      # SEO components
│   │   └── SEO.tsx
│   └── ui/                       # UI library components
│       ├── Button/
│       │   └── Button.tsx
│       ├── Input/
│       └── Select/
│
├── lib/                          # Third-party integrations & abstractions
│   ├── axios/                    # Axios configuration
│   │   ├── client.ts
│   │   ├── interceptors.ts
│   │   └── index.ts
│   ├── react-query/              # React Query configuration
│   │   ├── queryClient.ts
│   │   └── index.ts
│   └── validations/              # Validation library setup
│       ├── schemas/
│       └── index.ts
│
├── core/                         # Core business logic (framework-agnostic)
│   ├── business-rules/           # Business rules engine
│   │   ├── engine/
│   │   ├── registry/
│   │   ├── rules/
│   │   ├── registerDefaultRules.ts
│   │   └── index.ts
│   ├── operators/                # Custom operators
│   │   ├── registerDefaultOperators.ts
│   │   └── index.ts
│   ├── transformers/             # Data transformers
│   │   ├── registerDefaultTransformers.ts
│   │   └── index.ts
│   └── validators/               # Validation logic
│       ├── registerDefaultValidators.ts
│       └── index.ts
│
├── hooks/                        # Shared/global hooks
│   ├── useDebouncedEffect.ts
│   └── useLocalStorage.ts
│
├── utils/                        # Shared utility functions
│   ├── phoneUtils.ts
│   ├── fieldConditions.ts
│   ├── formDataTransformers.ts
│   └── helpers.ts
│
├── types/                        # Global type definitions
│   ├── api.types.ts
│   ├── common.types.ts
│   └── index.ts
│
├── config/                       # Application configuration
│   ├── constants.ts
│   ├── env.ts
│   └── index.ts
│
├── assets/                       # Static assets (if not in public)
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── styles/                       # Global styles
│   ├── index.css
│   ├── variables.css
│   └── reset.css
│
├── main.tsx                      # Application entry point
└── vite-env.d.ts                 # Vite type definitions
```

---

## Detailed Recommendations

### 1. Separate Features from Components

**Issue**: Page components are mixed with UI components.

**Solution**:

-   Create a `features/` directory to organize by business domain
-   Move EventPage, FormPage, SuccessPage into their respective feature folders
-   Keep only reusable UI components in `components/`

**Benefits**:

-   Clear distinction between feature-specific and reusable components
-   Easier to find feature-level code
-   Better scalability and team collaboration

### 2. Standardize Colocation Strategy

**Issue**: Inconsistent colocation (FormPage has hooks/, others don't).

**Solution**: Use full colocation within each feature module

```
features/form/
├── api/
├── components/
├── hooks/
├── contexts/
├── utils/
├── types/
└── FormPage.tsx
```

This keeps everything related to a feature in one place. Shared/reusable code goes in the top-level directories (components/, hooks/, utils/).

**Benefits**:

-   Predictable code location
-   Easier refactoring and feature deletion
-   Better team collaboration and parallel development
-   Clear boundaries between features

### 3. Consolidate Utils Directory

**Issue**: Duplicate files (`businessRules.ts` + `businessRules/` directory).

**Solution**:

-   Move all business logic to `core/` directory
-   Keep only generic utilities in `utils/`
-   Rename `transfomers/` to `transformers/` (fix typo)

**Before**:

```
utils/
├── businessRules/
├── businessRules.ts       # Duplicate!
├── operators/
├── transfomers/           # Typo!
```

**After**:

```
core/
├── business-rules/
├── operators/
├── transformers/          # Fixed typo
└── validators/

utils/
├── phoneUtils.ts
├── helpers.ts
└── formatters.ts
```

### 4. Create Types Directory

**Issue**: Types scattered across files.

**Solution**:

```
types/
├── api.types.ts           # API response/request types
├── form.types.ts          # Form-related types
├── event.types.ts         # Event-related types
├── common.types.ts        # Shared types
└── index.ts               # Re-export all types
```

**Usage**:

```typescript
// Instead of
import { EventInfo } from "../services/types";

// Use
import { EventInfo } from "@/types";
```

### 5. Setup Lib Directory

**Issue**: No abstraction for third-party libraries.

**Solution**:

```
lib/
├── axios/
│   ├── client.ts          # Axios instance
│   ├── interceptors.ts    # Request/response interceptors
│   └── index.ts
├── react-query/
│   ├── queryClient.ts     # Query client config
│   ├── queries.ts         # Query helpers
│   └── index.ts
└── validations/
    └── schemas/
```

**Example** (`lib/axios/client.ts`):

```typescript
import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});
```

### 6. Create Config Directory

**Issue**: No centralized configuration.

**Solution**:

```
config/
├── constants.ts           # App constants
├── env.ts                 # Environment variables
└── index.ts
```

**Example** (`config/env.ts`):

```typescript
export const env = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    isProd: import.meta.env.PROD,
    isDev: import.meta.env.DEV,
} as const;
```

### 7. Improve API Organization

**Issue**: Basic API files without proper structure.

**Solution**:

```
services/api/
├── client/
│   ├── axios.client.ts
│   └── interceptors.ts
├── endpoints/
│   ├── event.api.ts
│   ├── form.api.ts
│   └── index.ts
└── index.ts
```

### 8. Add Path Aliases

**Issue**: Relative imports like `../../utils/...` are hard to maintain.

**Solution**: Update `tsconfig.json`:

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
            "@/core/*": ["src/core/*"]
        }
    }
}
```

Update `vite.config.ts`:

```typescript
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
```

### 9. Organize Public Assets

**Current**:

```
public/
├── turnupblack.png
└── turnuplogo.png
```

**Recommended**:

```
public/
├── images/
│   ├── logos/
│   │   ├── turnup-black.png
│   │   └── turnup-logo.png
│   └── icons/
│       └── favicon.ico
└── fonts/
```

### 10. Add Index Files for Cleaner Imports

**Issue**: Multiple imports from same directory.

**Solution**: Add barrel exports.

**Example** (`components/ui/index.ts`):

```typescript
export { Button } from "./Button/Button";
export { Input } from "./Input/Input";
export { Select } from "./Select/Select";
```

**Usage**:

```typescript
// Instead of
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";

// Use
import { Button, Input } from "@/components/ui";
```

---

## Migration Strategy

### Phase 1: Foundation (Low Risk)

1. Create new directories: `types/`, `config/`, `lib/`, `hooks/`
2. Add path aliases to tsconfig and vite.config
3. Move global types to `types/`
4. Create config files in `config/`
5. Set up API client in `lib/axios/`

### Phase 2: Reorganization (Medium Risk)

1. Create `features/` directory with initial structure
2. Migrate EventPage to `features/event/`
3. Migrate FormPage to `features/form/` with all its colocated files
4. Migrate SuccessPage to `features/success/`
5. Consolidate utils directory
6. Move business logic to `core/`
7. Update all imports throughout the codebase

### Phase 3: Refinement (Low Risk)

1. Add barrel exports (index.ts files)
2. Reorganize public assets
3. Split large components
4. Add documentation

### Phase 4: Optimization

1. Review and optimize bundle sizes
2. Implement code splitting
3. Add storybook for UI components
4. Set up automated tests per feature

---

## Best Practices to Follow

### File Naming Conventions

-   **Components**: PascalCase (e.g., `EventPage.tsx`, `Button.tsx`)
-   **Utilities**: camelCase (e.g., `phoneUtils.ts`, `formatters.ts`)
-   **Types**: camelCase with `.types.ts` suffix (e.g., `form.types.ts`)
-   **Hooks**: camelCase starting with `use` (e.g., `useFormState.ts`)
-   **Constants**: camelCase with `.constants.ts` (e.g., `api.constants.ts`)
-   **Config**: camelCase (e.g., `env.ts`, `constants.ts`)

### Directory Naming Conventions

-   Use kebab-case for directories: `business-rules/`, `form-page/`
-   Use plural for collections: `components/`, `hooks/`, `utils/`
-   Use singular for specific features: `form/`, `event/`

### Code Organization Rules

1. **One component per file**: Each component should have its own file
2. **Colocate related files**: Keep tests, styles, and types near components
3. **Keep files small**: Aim for <250 lines per file
4. **Avoid deep nesting**: Max 3-4 levels of directory nesting
5. **Use barrel exports**: Create index.ts for cleaner imports

### Import Order

```typescript
// 1. External dependencies
import { useState, useEffect } from "react";
import axios from "axios";

// 2. Internal aliases (absolute imports)
import { Button } from "@/components/ui";
import { useFormState } from "@/hooks/form";
import { apiClient } from "@/lib/axios";

// 3. Relative imports
import { FormField } from "./components/FormField";
import styles from "./FormPage.module.css";

// 4. Types
import type { FormData } from "@/types";
```

---

## Benefits of Proposed Structure

### Scalability

-   Easy to add new features without affecting existing code
-   Clear boundaries between features
-   Supports team growth and parallel development

### Maintainability

-   Predictable file locations
-   Easier to find and update code
-   Reduced cognitive load

### Developer Experience

-   Faster onboarding for new developers
-   Consistent patterns across codebase
-   Better IDE support with path aliases

### Code Quality

-   Enforces separation of concerns
-   Reduces code duplication
-   Easier to write tests

### Performance

-   Better tree-shaking with proper exports
-   Easier to implement code splitting
-   Optimized bundle sizes

---

## Comparison: Current vs. Recommended

| Aspect                     | Current               | Recommended                             |
| -------------------------- | --------------------- | --------------------------------------- |
| **Component Organization** | Mixed (pages + UI)    | Separated (features/pages + components) |
| **Colocation**             | Inconsistent          | Consistent (per-feature)                |
| **Type Definitions**       | Scattered             | Centralized in types/                   |
| **API Layer**              | Basic files           | Abstracted client + endpoints           |
| **Utils**                  | Mixed (flat + nested) | Organized (core/ + utils/)              |
| **Config**                 | None                  | Centralized in config/                  |
| **Imports**                | Relative paths        | Path aliases                            |
| **Third-party Setup**      | Inline                | Abstracted in lib/                      |
| **Asset Organization**     | Flat in public/       | Organized by type                       |
| **Scalability**            | Limited               | High                                    |

---

## Tools & Resources

### Recommended Tools

-   **ESLint**: Enforce import order and naming conventions
-   **Prettier**: Consistent code formatting
-   **lint-staged**: Pre-commit hooks for code quality
-   **Storybook**: UI component documentation
-   **Vitest**: Unit testing
-   **Playwright**: E2E testing

### Useful ESLint Plugins

```json
{
    "plugins": ["import", "simple-import-sort", "unused-imports"],
    "rules": {
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "import/first": "error",
        "import/newline-after-import": "error",
        "unused-imports/no-unused-imports": "error"
    }
}
```

---

## Next Steps

1. **Review & Discuss**: Share this document with the team
2. **Plan Migration**: Create detailed migration tasks based on the 4-phase strategy
3. **Start Small**: Begin with Phase 1 (foundation) - low risk changes
4. **Iterate**: Gradually move to Phases 2-4, testing at each step
5. **Document**: Update team documentation as you migrate
6. **Measure**: Track bundle sizes, build times, and developer feedback
7. **Refine**: Adjust the structure based on team learnings

---

## Conclusion

Reorganizing your folder structure is an investment that will pay dividends in maintainability, scalability, and developer experience. The feature-based structure follows industry standards used by successful React applications and provides a solid foundation for future growth.

**Key Takeaways**:

-   Organize code by features/domains using the `features/` directory
-   Separate feature-specific code from shared/reusable components
-   Adopt full colocation within features for better modularity
-   Centralize types, config, and third-party integrations
-   Use path aliases for cleaner, more maintainable imports
-   Follow established naming conventions consistently
-   Migrate incrementally (4 phases) to minimize risk

Start with the foundation phase and iterate based on team feedback. The goal is not perfection but continuous improvement toward a more maintainable, scalable codebase that supports team growth and parallel development.
