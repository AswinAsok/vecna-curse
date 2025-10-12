import type { EventData } from "../features/event/types/event.types";
import type { FormField } from "../types/form.types";
import { operatorRegistry } from "../core/operators";

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
        field: string;
        value: string;
        operator: string;
    };

    if (!fieldId || !conditionValue) {
        return true;
    }

    // Find the referenced field to get its field_key
    const referencedField = allFormFields.find((f) => f.id === fieldId);
    if (!referencedField) {
        return true;
    }

    const currentValue = formData[referencedField.field_key] || "";

    // Use operator registry instead of switch
    return operatorRegistry.evaluate(operator, currentValue, conditionValue);
};

/**
 * Validates if a field should be displayed based on its conditions
 * Includes special business rules for email field visibility
 */
export const doesFieldValidatesConditions = ({
    field,
    formData,
    eventData,
}: {
    field: FormField;
    formData: Record<string, string>;
    eventData: EventData;
}): boolean => {
    // Check standard field conditions
    if (!checkFieldConditions(field, formData, eventData.form)) {
        return false;
    }

    return true;
};
