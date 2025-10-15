import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";

import { useSubmissionState } from "./useSubmissionState";

describe("useSubmissionState", () => {
    it("should initalize with not submitting state", () => {
        const { result } = renderHook(() => useSubmissionState());

        expect(result.current.isSubmitting).toBe(false);
        expect(result.current.isSubmitted).toBe(false);
        expect(result.current.submitResponse).toBeNull();
    });

    it("should set submitting state", () => {
        const { result } = renderHook(() => useSubmissionState());

        act(() => {
            result.current.setIsSubmitting(true);
        });

        expect(result.current.isSubmitting).toBe(true);
    });

    it("should set error message", () => {
        const { result } = renderHook(() => useSubmissionState());

        act(() => {
            result.current.setError("Submission failed");
        });

        expect(result.current.error).toBe("Submission failed");
    });

    it("should clear error", () => {
        const { result } = renderHook(() => useSubmissionState());

        act(() => {
            result.current.setError("Error");
            result.current.setError(null);
        });

        expect(result.current.error).toBeNull();
    });
});
