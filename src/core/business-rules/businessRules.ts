import type { FormField } from "../../types/form.types";
import { extractCountryCode } from "../../utils/phoneUtils";

/**
 * Determines if email field should be validated based on phone country code
 * Business rule: Email is only required if phone code is not +91 (Indian)
 */
export const shouldValidateEmailField = (
    allFormFields: FormField[],
    formData: Record<string, string>
): boolean => {
    const phoneFields = allFormFields.filter((f) => f.type === "phone");

    // Check if any phone field has a country code that's not +91
    const hasNonIndianPhone = phoneFields.some((phoneField) => {
        const code = extractCountryCode(formData[phoneField.field_key]);
        return code !== "+91";
    });

    return hasNonIndianPhone;
};
