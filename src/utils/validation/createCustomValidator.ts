import type { FormField } from "../../types/form.types";
import type { ValidatorFunction } from "./validatorRegistry";

export const createCustomValidator = (
    shouldValidate: (field: FormField) => boolean,
    isValid: (value: string) => boolean,
    errorMessage: string
): ValidatorFunction => {
    return (field, value) => {
        if (!shouldValidate(field) || !value || value.trim() === "") {
            return { isValid: true };
        }

        return isValid(value) ? { isValid: true } : { isValid: false, error: errorMessage };
    };
};
