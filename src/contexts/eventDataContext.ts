import React, { createContext } from "react";
import type { EventData } from "../features/event/types/event.types";

export const EventDataContext = createContext<EventData | null>(null);

export const useEventDataContext = () => {
    const context = React.useContext(EventDataContext);
    if (!context) {
        throw new Error("useEventDataContext must be used within an EventDataProvider");
    }
    return context;
};
