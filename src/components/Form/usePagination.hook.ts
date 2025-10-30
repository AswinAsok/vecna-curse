import { useEffect, useMemo, useRef, useState } from "react";
import { useEventDataContext } from "../../contexts/eventDataContext";
import type { FormField } from "../../services/types";

export const usePagination = () => {
    const eventData = useEventDataContext();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const justNavigatedRef = useRef(false);

    // Reset navigation flag after page change
    useEffect(() => {
        if (justNavigatedRef.current) {
            const timer = setTimeout(() => {
                justNavigatedRef.current = false;
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [currentPage]);

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
    const currentFields = pageGroups[currentPage] || [];

    const handleNext = () => {
        if (currentPage < totalPages) {
            justNavigatedRef.current = true;
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            justNavigatedRef.current = true;
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleBack = () => {
        if (currentPage > 1) {
            handlePrevious();
        }
    };

    const navigateToPage = (pageNum: number) => {
        if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
            justNavigatedRef.current = true;
            setCurrentPage(pageNum);
        }
    };

    return {
        currentPage,
        totalPages,
        currentFields,
        handleNext,
        handlePrevious,
        handleBack,
        navigateToPage,
        errors,
        setErrors,
        justNavigatedRef,
    };
};
