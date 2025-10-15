import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockFormField } from "@/core/__tests__/helpers";

import { usePagination } from "./usePagination.hook";

describe("usePagination", () => {
    const form = [
        { ...mockFormField(), page_num: 1, id: "1" },
        { ...mockFormField(), page_num: 1, id: "2" },
        { ...mockFormField(), page_num: 2, id: "3" },
    ];

    it("should initialize with first page", () => {
        const { result } = renderHook(() => usePagination({ form }));
        expect(result.current.currentPage).toBe(1);
    });

    it("should return fields for the current page only", () => {
        const { result } = renderHook(() => usePagination({ form }));
        expect(result.current.pageGroups[1]).toHaveLength(2);
        expect(result.current.pageGroups[1][0].id).toBe("1");
    });

    it("should navigate to next page", () => {
        const { result } = renderHook(() => usePagination({ form }));

        act(() => {
            result.current.handleNext();
        });

        const currentPage = result.current.currentPage;
        expect(currentPage).toBe(2);
        expect(result.current.pageGroups[currentPage]).toHaveLength(1);
    });

    it("should navgiate to previous page", () => {
        const { result } = renderHook(() => usePagination({ form }));

        act(() => {
            result.current.handleNext();
        });

        act(() => {
            result.current.handlePrevious();
        });

        expect(result.current.currentPage).toBe(1);
    });

    it("should not go below page 1", () => {
        const { result } = renderHook(() => usePagination({ form }));

        act(() => {
            result.current.handlePrevious();
        });

        expect(result.current.currentPage).toBe(1);
    });

    it("should not exceed total pages", () => {
        const { result } = renderHook(() => usePagination({ form }));

        act(() => {
            result.current.handleNext();
        });

        act(() => {
            result.current.handleNext();
        });

        expect(result.current.currentPage).toBe(2);
    });

    it("should calculate total pages correctly", () => {
        const { result } = renderHook(() => usePagination({ form }));
        expect(result.current.totalPages).toBe(2);
    });

    it("should filter hidden fields from page", () => {
        const fieldsWithHidden = [
            { ...mockFormField(), page_num: 1, id: "1", hidden: false },
            { ...mockFormField(), page_num: 1, id: "2", hidden: true },
        ];

        const { result } = renderHook(() => usePagination({ form: fieldsWithHidden }));

        console.log();
        expect(Object.keys(result.current.pageGroups)).toHaveLength(1);
    });
});
