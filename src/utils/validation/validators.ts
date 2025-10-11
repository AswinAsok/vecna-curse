import type { FormField } from "../../services/types";
import { validatorRegistry, type ValidationResult } from "./validatorRegistry";

export const validateField = (field: FormField, value: string | undefined): ValidationResult => {
    return validatorRegistry.validate(field, value);
};
