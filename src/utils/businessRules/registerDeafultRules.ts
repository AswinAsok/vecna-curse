import { emailRequiredForNonIndianPhone } from "./emailCountryRule";
import { businessRuleRegistry } from "./rulesRegistry";

export const registerDefaultBusinessRules = (): void => {
    // Email field rules
    businessRuleRegistry.register("email", emailRequiredForNonIndianPhone);
};
