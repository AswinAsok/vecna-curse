import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useFormState } from "./useFormState";

describe("useFormState", () => {
    it("should initalize with empty form data", () => {
        const { result } = renderHook(() => useFormState());
        expect(result.current.formData).toEqual({});
    });

    it("should update field value", () => {
        const { result } = renderHook(() => useFormState());
        act(() => {
            result.current.updateField("name", "John Doe");
        });
        expect(result.current.formData.name).toBe("John Doe");
    });

    it("should update mulitple fields", () => {
        const { result } = renderHook(() => useFormState());

        act(() => {
            result.current.updateField("name", "John");
            result.current.updateField("email", "john@example.com");
        });

        expect(result.current.formData).toEqual({
            name: "John",
            email: "john@example.com",
        });
    });

    it("should overwrite existing field values", () => {
        const { result } = renderHook(() => useFormState());

        act(() => {
            result.current.updateField("name", "John");
            result.current.updateField("name", "Jane");
        });

        expect(result.current.formData.name).toBe("Jane");
    });

    it("should set entire form data", () => {
        const { result } = renderHook(() => useFormState());

        act(() => {
            result.current.setFormData({ name: "John", age: "25" });
        });

        expect(result.current.formData).toEqual({
            name: "John",
            age: "25",
        });
    });

    it("should reset form to empty state", () => {
        const { result } = renderHook(() => useFormState());

        act(() => {
            result.current.updateField("name", "John");
            result.current.updateField("email", "john@example.com");
            result.current.resetForm();
        });

        expect(result.current.formData).toEqual({});
    });

    it("should preserve other fields when updating one field", () => {
        const { result } = renderHook(() => useFormState());

        act(() => {
            result.current.updateField("name", "John");
            result.current.updateField("email", "john@example.com");
            result.current.updateField("name", "Jane");
        });

        expect(result.current.formData).toEqual({
            name: "Jane",
            email: "john@example.com",
        });
    });
});
