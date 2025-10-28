import toast from "react-hot-toast";
import type { FormField } from "../../services/types";

/**
 * Extracts phone number without country code prefix
 */
export const getPhoneNumberWithoutCode = (fullPhone: string, currentCode: string): string => {
    if (fullPhone.startsWith(currentCode)) {
        return fullPhone.slice(currentCode.length);
    }
    return fullPhone;
};

/**
 * Checks if field conditions are met based on form data
 */
export const checkFieldConditions = (
    field: FormField,
    formData: Record<string, string>,
    allFormFields: FormField[]
): boolean => {
    if (!field.conditions || Object.keys(field.conditions).length === 0) {
        return true;
    }

    const {
        field: fieldId,
        value: conditionValue,
        operator,
    } = field.conditions as {
        field?: string;
        value?: string;
        operator?: string;
    };

    if (!fieldId || !conditionValue) {
        return true;
    }

    // Find the referenced field to get its field_key
    const referencedField = allFormFields.find((f) => f.id === fieldId);
    if (!referencedField) {
        return true;
    }

    const currentValue = formData[referencedField.field_key];

    switch (operator) {
        case "=":
            return currentValue === conditionValue;
        case "!=":
            return currentValue !== conditionValue;
        default:
            return true;
    }
};

export const getTicketIdBasedOnRadio = (formData: FormData): string | undefined => {
    const radioSelection = formData.get("who_walks_willingly_into_the_nwod_edispu") as string;

    switch (radioSelection) {
        case "🕷 The Marked One (Stag Male) – Heard the clock. Chose to stay.":
            return "cabe5bb9-babf-4dbf-8ea4-d98cfe38c9a7";
        case "🩸 The Unshaken (Stag Female) – Not afraid of the flicker.":
            return "03abcfe7-8221-45ea-9f82-53d4efaeb348";
        case "👁 The Bonded Souls (Couple) – If Vecna takes one, he takes both.":
            return "43d8d3f6-7a90-435a-b908-db861c339477";
        default:
            toast.error("Something went wrong. Please try again.");
    }
};
