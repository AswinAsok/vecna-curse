import type { FormField } from "../../services/types";

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export type ValidatorFunction = (field: FormField, value: string | undefined) => ValidationResult;

const createValidatorRegistry = () => {
    const validators: ValidatorFunction[] = [];

    return {
        register: (validator: ValidatorFunction): void => {
            validators.push(validator);
        },

        validate: (field: FormField, value: string | undefined): ValidationResult => {
            for (const validator of validators) {
                const result = validator(field, value);
                if (!result.isValid) {
                    return result;
                }
            }
            return { isValid: true };
        },

        clear: (): void => {
            validators.length = 0;
        },

        count: (): number => validators.length,
    };
};

export const validatorRegistry = createValidatorRegistry();
