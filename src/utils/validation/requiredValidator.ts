import type { ValidatorFunction } from "./validatorRegistry";

export const requiredValidator: ValidatorFunction = (field, value) => {
    if (!field.required) {
        return { isValid: true };
    }

    const hasValue = Boolean(value && value.trim() !== "");

    return hasValue
        ? { isValid: true }
        : {
              isValid: false,
              error: "This field is required",
          };
};
