import { EventPage } from "@/features/event";
import { SuccessPage } from "@/features/success";

/**
 * Application routes configuration
 *
 * Note: Currently the app uses a single-page navigation pattern.
 * This configuration is set up for future React Router integration.
 */
export const routes = [
    {
        path: "/",
        element: <EventPage />,
        name: "Event & Form",
    },
    {
        path: "/success",
        element: <SuccessPage />,
        name: "Success",
    },
];

export type RouteConfig = typeof routes[number];
