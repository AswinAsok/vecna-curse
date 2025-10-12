import { createContext, useContext } from "react";

export const PaginationDataContext = createContext<number | null>(null);

export const usePaginationContext = () => {
    const context = useContext(PaginationDataContext);

    if (!context) {
        throw new Error("usePaginationContext must be used within an PaginationProvider");
    }

    return context;
};
