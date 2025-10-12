import type { ValidatorFunction } from "./validatorRegistry";

export const emailValidator: ValidatorFunction = (field, value) => {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (field.type !== "email" || !value || value.trim() === "") {
        return {
            isValid: true,
        };
    }

    const isValid = EMAIL_REGEX.test(value);

    return isValid
        ? {
              isValid: true,
          }
        : {
              isValid: false,
              error: "Please enter a valid email address",
          };
};
