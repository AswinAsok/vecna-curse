import { lazy, Suspense } from "react";

import { Loading } from "@/components/ui";

/**
 * Lazy-loaded route components for code splitting
 *
 * This configuration enables code splitting by dynamically importing
 * feature modules only when they're needed, reducing initial bundle size.
 */

// Lazy load feature components
// Import specific components, not barrel exports, for React.lazy()
const EventPage = lazy(() => import("@/features/event/EventPage"));
const SuccessPage = lazy(() => import("@/features/success/SuccessPage"));

// Wrapper component with Suspense
const withSuspense = (Component: React.ComponentType) => (
    <Suspense fallback={<Loading size={60} />}>
        <Component />
    </Suspense>
);

/**
 * Lazy-loaded routes configuration
 * Use this when integrating React Router for optimal performance
 */
export const lazyRoutes = [
    {
        path: "/",
        element: withSuspense(EventPage),
        name: "Event & Form",
    },
    {
        path: "/success",
        element: withSuspense(SuccessPage),
        name: "Success",
    },
];

export type LazyRouteConfig = typeof lazyRoutes[number];
