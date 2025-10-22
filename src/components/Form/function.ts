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
            return "711b96c6-b9d9-4995-a86b-ac2d1b53b1f7";
        case "🩸 The Unshaken (Stag Female) – Not afraid of the flicker.":
            return "c2f97b31-5d21-4de9-8aa4-b7924f1d462d";
        case "👁 The Bonded Souls (Couple) – If Vecna takes one, he takes both.":
            return "19350de5-0a26-49e8-9e9c-3051dba46989";
        default:
            toast.error("Something went wrong. Please try again.");
    }
};
