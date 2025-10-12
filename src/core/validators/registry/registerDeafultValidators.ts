// registerDefaultValidators.ts
import { emailValidator } from "./emailValidator";
import { requiredValidator } from "./requiredValidator";
import { validatorRegistry } from "./validatorRegistry";

export const registerDefaultValidators = (): void => {
    // Order matters - required should be checked first
    validatorRegistry.register(requiredValidator);
    validatorRegistry.register(emailValidator);
};
