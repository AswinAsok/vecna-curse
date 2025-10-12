import type { FormField } from "../../types/form.types";
import { validatorRegistry, type ValidationResult } from "./validatorRegistry";

export const validateField = (field: FormField, value: string | undefined): ValidationResult => {
    return validatorRegistry.validate(field, value);
};
