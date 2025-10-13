import { useMemo, useState } from "react";

import type { FormField } from "../../../types/form.types";
import { useEventDataContext } from "../contexts/eventDataContext";

export const usePagination = () => {
    const eventData = useEventDataContext();

    const [currentPage, setCurrentPage] = useState<number>(1);

    const pageGroups = useMemo(() => {
        const groups: Record<number, FormField[]> = {};
        eventData.form.forEach((field) => {
            if (!field.hidden) {
                if (!groups[field.page_num]) {
                    groups[field.page_num] = [];
                }
                groups[field.page_num].push(field);
            }
        });
        return groups;
    }, [eventData.form]);

    const totalPages = Object.keys(pageGroups).length;

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return {
        currentPage,
        totalPages,
        pageGroups,
        handleNext,
        handlePrevious,
    };
};
