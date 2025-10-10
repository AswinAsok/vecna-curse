import toast from "react-hot-toast";
import type { FormField } from "../../../services/types";
import countryCodes from "../data/phoneCountryCodes.json";

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
            return "749a205d-5094-460c-85fb-faca0bbd9894";
        case "🩸 The Unshaken (Stag Female) – Not afraid of the flicker.":
            return "8839c1be-b1b8-4d20-a469-7cbdf12de501";
        case "👁 The Bonded Souls (Couple) – If Vecna takes one, he takes both.":
            return "646d2ca6-f068-4b01-a3b9-a5363dff9965";
        default:
            toast.error("Something went wrong. Please try again.");
    }
};

export const extractCountryCode = (value: string): string => {
    if (value) {
        const currentCountryCodes = countryCodes.map((country) => country.dial_code);

        const extractedCode = currentCountryCodes.find((code) => {
            return value.startsWith(code);
        });

        return extractedCode || "+91";
    }

    return "+91";
};
