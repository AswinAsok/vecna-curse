import type { FormField } from "../../../types/form.types";

export interface RuleContext {
    field: FormField;
    formData: Record<string, string>;
    allFormFields: FormField[];
}

export type RuleFunction = (context: RuleContext) => boolean;

const createBusinessRuleRegistry = () => {
    const rules = new Map<string, RuleFunction[]>();

    return {
        register: (fieldKey: string, rule: RuleFunction): void => {
            if (!rules.has(fieldKey)) {
                rules.set(fieldKey, []);
            }
            rules.get(fieldKey)!.push(rule);
        },

        shouldValidate: (context: RuleContext): boolean => {
            const fieldRules = rules.get(context.field.field_key);

            if (!fieldRules || fieldRules.length === 0) {
                return true; // No rules = always validate
            }

            return fieldRules.some((rule) => rule(context));
        },
    };
};

export const businessRuleRegistry = createBusinessRuleRegistry();
