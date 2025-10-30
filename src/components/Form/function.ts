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
            return "65696356-86cd-45de-acb2-5fe184adad21";
        case "🩸 The Unshaken (Stag Female) – Not afraid of the flicker.":
            return "7193b545-d94e-4509-b240-27037c4c1921";
        case "👁 The Bonded Souls (Couple) – If Vecna takes one, he takes both.":
            return "81363783-84e5-48f0-8ff3-8d87439ae256";
        default:
            toast.error("Something went wrong. Please try again.");
    }
};
