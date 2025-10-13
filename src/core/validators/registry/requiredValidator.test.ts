import { describe, it } from "node:test";

import { expect } from "vitest";

import type { FormField } from "@/types/form.types";

import { requiredValidator } from "./requiredValidator";

describe("requiredValidator", () => {
    const mockRequiredField: FormField = {
        id: "1",
        type: "text",
        title: "Name",
        required: true,
        field_key: "name",
        hidden: false,
        unique: null,
        options: [],
        page_num: 1,
        property: {},
        conditions: {},
        team_field: false,
        description: null,
        placeholder: "Enter name",
    };

    it("should validate required field with values", () => {
        const result = requiredValidator(mockRequiredField, "John Doe");
        expect(result).toBe(true);
    });

    it("should reject empty required fields", () => {
        const result = requiredValidator(mockRequiredField, "");
        expect(result).toBe("This field is required");
    });

    it("should reject whitespace-only values", () => {
        const result = requiredValidator(mockRequiredField, "   ");
        expect(result).toBe("This field is required");
    });

    it("should pass validation for non-required fields", () => {
        const optionalField = { ...mockRequiredField, required: false };
        const result = requiredValidator(optionalField, "");
        expect(result.isValid).toBe(true);
    });
});
