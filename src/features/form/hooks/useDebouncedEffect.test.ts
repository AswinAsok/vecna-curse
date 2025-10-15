import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebouncedEffect } from "./useDebouncedEffect";

describe("useDebouncedEffect", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it("should not call callback immediately", () => {
        const callback = vi.fn();
        renderHook(() => useDebouncedEffect(callback, [], 500));

        expect(callback).not.toHaveBeenCalled();
    });

    it("should call callback after delay", () => {
        const callback = vi.fn();
        renderHook(() => useDebouncedEffect(callback, [], 500));

        vi.advanceTimersByTime(500);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should cancel previous timeout on re-render", () => {
        const callback = vi.fn();
        const { rerender } = renderHook(
            ({ value }: { value: string }) => useDebouncedEffect(callback, [value], 500),
            { initialProps: { value: "initial" } }
        );

        vi.advanceTimersByTime(250);
        expect(callback).not.toHaveBeenCalled();

        rerender({ value: "updated" });
        vi.advanceTimersByTime(250);
        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(250);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should cleanup timeout on unmount", () => {
        const callback = vi.fn();
        const { unmount } = renderHook(() => [useDebouncedEffect(callback, [], 500)]);

        unmount();
        vi.advanceTimersByTime(500);
        expect(callback).not.toHaveBeenCalled();
    });
});
