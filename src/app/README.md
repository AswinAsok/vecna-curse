# App Directory

This directory contains application-level configuration and setup.

## Routes

The `routes/` directory contains route definitions for the application.

### Standard Routes (`routes/index.tsx`)
- Non-lazy loaded routes
- Suitable for critical routes that need to load immediately
- Currently used in the application

### Lazy Routes (`routes/lazyRoutes.tsx`)
- Code-split routes using React.lazy()
- Reduces initial bundle size
- Ready for React Router integration

## Usage

### Current Setup (No Router)
The app currently uses a single-page pattern. Routes are defined for future use.

### When Integrating React Router

**Option 1: Standard Routes (faster initial load for small apps)**
```typescript
import { routes } from "@/app";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(routes);

function App() {
    return <RouterProvider router={router} />;
}
```

**Option 2: Lazy Routes (better for larger apps)**
```typescript
import { lazyRoutes } from "@/app";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(lazyRoutes);

function App() {
    return <RouterProvider router={router} />;
}
```

### Benefits of Lazy Loading

1. **Reduced Initial Bundle**: Only the code for the current route is loaded
2. **Faster Time to Interactive**: Users see content sooner
3. **Better Performance**: Especially beneficial for apps with many routes
4. **Automatic Code Splitting**: Vite/Rollup automatically creates separate chunks

## Adding New Routes

1. Define the route in both `routes/index.tsx` and `routes/lazyRoutes.tsx`
2. Ensure the feature has a default export for lazy loading
3. Update this documentation if needed

Example:
```typescript
// In routes/index.tsx
{
    path: "/new-feature",
    element: <NewFeature />,
    name: "New Feature",
}

// In routes/lazyRoutes.tsx
const NewFeature = lazy(() => import("@/features/new-feature"));

{
    path: "/new-feature",
    element: withSuspense(NewFeature),
    name: "New Feature",
}
```
