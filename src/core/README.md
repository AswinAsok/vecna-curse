# Core Directory

This directory contains framework-agnostic business logic that can be used across the application.

## Modules

- **business-rules**: Business rules engine for conditional validation logic
- **operators**: Custom operators for rule evaluation (equals, contains, etc.)
- **transformers**: Data transformation logic (social media links, trimming, etc.)
- **validators**: Field validation logic (email, required, custom validators)

## Principles

1. **Framework Agnostic**: Code in this directory should be pure TypeScript with no React dependencies
2. **Reusable**: Logic here can be used across different features
3. **Testable**: Pure functions are easier to test
4. **Well Documented**: Each module should have clear documentation

## Usage

Import from the barrel export:

```typescript
import {
  registerDefaultValidators,
  registerDefaultOperators,
  registerDefaultTransformers,
  registerDefaultBusinessRules
} from '@/core';
```

Or import from specific modules:

```typescript
import { validateField } from '@/core/validators';
import { businessRuleRegistry } from '@/core/business-rules';
import { operatorRegistry } from '@/core/operators';
import { transformerRegistry } from '@/core/transformers';
```

## Adding New Core Logic

When adding new core logic, follow these steps:

1. Create the logic in the appropriate subdirectory
2. Export it from the module's `index.ts`
3. Ensure it's framework-agnostic (no React imports)
4. Add tests if possible
5. Document the functionality
