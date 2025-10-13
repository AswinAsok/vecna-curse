import { describe, expect, it } from "vitest";

import type { FormField } from "@/types/form.types";

import { emailRequiredForNonIndianPhone } from "./emailCountryRule";
import type { RuleContext } from "./rulesRegistry";

const mockFormField: FormField = {
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

const mockPhoneField: FormField = {
    ...mockFormField,
    id: "2",
    type: "phone",
    field_key: "phone",
    title: "Phone Number",
};

const mockTextField: FormField = {
    ...mockFormField,
    id: "3",
    type: "text",
    field_key: "name",
};

const mockFormData: Record<string, string> = {
    email: "test@example.com",
    phone: "+919876543210",
    name: "John Doe",
};

const mockContext: RuleContext = {
    field: mockFormField,
    formData: mockFormData,
    allFormFields: [mockTextField, mockPhoneField],
};

const createMockContext = (phone: string) => {
    return {
        ...mockContext,
        formData: {
            ...mockFormData,
            phone: phone,
        },
    };
};

describe("emailRequiredForNonIndianPhone", () => {
    it("should return true when the number is not +91", () => {
        const result = emailRequiredForNonIndianPhone(createMockContext("+14155552671"));

        expect(result).toBe(true);
    });

    it("should return true when the number is  +91", () => {
        const result = emailRequiredForNonIndianPhone(createMockContext("+91155552671"));

        expect(result).toBe(false);
    });

    it("should handle missing phone field", () => {
        const result = emailRequiredForNonIndianPhone(createMockContext(""));

        expect(result).toBe(false);
    });

    it("should return true when ANY phone field is non-Indian", () => {
        const context: RuleContext = {
            field: mockFormField,
            formData: {
                phone1: "+919876543210", // Indian
                phone2: "+14155552671", // US
            },
            allFormFields: [
                { ...mockPhoneField, field_key: "phone1" },
                { ...mockPhoneField, field_key: "phone2" },
            ],
        };
        const result = emailRequiredForNonIndianPhone(context);

        expect(result).toBe(true);
    });
});
