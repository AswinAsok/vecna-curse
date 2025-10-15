import { operatorRegistry } from "../../../core/operators";
import type { FormField } from "../../../types/form.types";
import type { EventData } from "../../event/types/event.types";

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

    const referencedField = allFormFields.find((f) => f.id === fieldId);
    if (!referencedField) {
        return true;
    }

    const currentValue = formData[referencedField.field_key] || "";

    return operatorRegistry.evaluate(operator, currentValue, conditionValue);
};

export const doesFieldValidatesConditions = ({
    field,
    formData,
    eventData,
}: {
    field: FormField;
    formData: Record<string, string>;
    eventData: EventData;
}): boolean => {
    if (field.hidden || !checkFieldConditions(field, formData, eventData.form)) {
        return false;
    }

    return true;
};
