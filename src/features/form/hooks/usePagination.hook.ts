import { useMemo, useState } from "react";

import type { FormField } from "../../../types/form.types";

export const usePagination = ({ form }: { form: FormField[] }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);

    const pageGroups = useMemo(() => {
        const groups: Record<number, FormField[]> = {};
        form.forEach((field) => {
            if (!field.hidden) {
                if (!groups[field.page_num]) {
                    groups[field.page_num] = [];
                }
                groups[field.page_num].push(field);
            }
        });
        return groups;
    }, [form]);

    const totalPages = Object.keys(pageGroups).length;

    const handleNext = () => {
        const maxPageNumber = Math.max(...Object.keys(pageGroups).map((key) => Number(key)));

        if (currentPage < totalPages && currentPage < maxPageNumber) {
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
