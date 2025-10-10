import type { FormField } from "../services/types";

/**
 * Validates if a required field has a value
 */
export const isRequiredFieldValid = (value: string | undefined): boolean => {
    return Boolean(value && value.trim() !== "");
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

/**
 * Validates a single field based on its type and requirements
 */
export const validateField = (
    field: FormField,
    value: string | undefined
): { isValid: boolean; error?: string } => {
    // Check required field
    if (field.required && !isRequiredFieldValid(value)) {
        return {
            isValid: false,
            error: "This field is required",
        };
    }

    // Check email format if field is email type and has value
    if (field.type === "email" && value && value.trim() !== "") {
        if (!isValidEmail(value)) {
            return {
                isValid: false,
                error: "Please enter a valid email address",
            };
        }
    }

    return { isValid: true };
};
