import { type FormField } from "../../services/eventApi";

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
