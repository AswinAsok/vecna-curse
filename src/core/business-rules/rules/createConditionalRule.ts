import type { RuleFunction } from "./rulesRegistry";

export const createConditionalRule = (
    dependsOnFieldKey: string,
    shouldValidateWhen: (value: string) => boolean
): RuleFunction => {
    return (context) => {
        const dependencyValue = context.formData[dependsOnFieldKey];
        return shouldValidateWhen(dependencyValue);
    };
};
