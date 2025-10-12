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
2. Add subdirectories as needed: `api/`, `components/`, `hooks/`, `types/`, `utils/`
3. Create feature entry point: `YourFeature.tsx`
4. Export from `index.ts` for clean public API
5. Follow the pattern of existing features for consistency

## Feature Structure

Each feature should follow this structure:

```
your-feature/
├── api/              # API calls specific to this feature
├── components/       # Components specific to this feature
├── hooks/           # Hooks specific to this feature
├── types/           # Types specific to this feature (or use global types)
├── utils/           # Utility functions specific to this feature
├── contexts/        # Context providers (if needed)
├── YourFeature.tsx  # Main feature component
└── index.ts         # Barrel export for public API
```

## Best Practices

-   Keep features independent and loosely coupled
-   Use barrel exports (`index.ts`) for clean public APIs
-   Share code through the `@/core`, `@/components`, and `@/utils` directories
-   Use feature contexts for feature-specific state
-   Import from other features only through their barrel exports
