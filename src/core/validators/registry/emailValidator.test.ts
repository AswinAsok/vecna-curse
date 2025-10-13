import { it } from "node:test";

import { describe, expect } from "vitest";

import type { FormField } from "@/types/form.types";

import { emailValidator } from "./emailValidator";

describe("emailValidator", () => {
    const mockEmailField: FormField = {
        id: "1",
        type: "email",
        title: "Email",
        required: true,
        field_key: "email",
        hidden: false,
        unique: null,
        options: [],
        page_num: 1,
        property: {},
        conditions: {},
        team_field: false,
        description: null,
        placeholder: "Enter Email",
    };

    it("should validate correct email addresses", () => {
        const result = emailValidator(mockEmailField, "test@example.com");
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
    });

    it("should reject invalid email addresses", () => {
        const result = emailValidator(mockEmailField, "invalid-email");
        expect(result.isValid).toBe(false);
        expect(result.error).toBeInstanceOf(String);
    });

    it("should pass validation for empty non-email fields", () => {
        const nonEmailField = { ...mockEmailField, type: "text" };
        const result = emailValidator(nonEmailField, "");
        expect(result.isValid).toBe(true);
    });

    it("should pass validation for empty email value", () => {
        const result = emailValidator(mockEmailField, "");
        expect(result.isValid).toBe(true);
    });

    it("should handle whitespace-only values", () => {
        const result = emailValidator(mockEmailField, "   ");
        expect(result.isValid).toBe(true);
    });
});
