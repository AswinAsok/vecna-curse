export type OperatorFunction = (currentValue: string, conditionValue: string) => boolean;

const createOperatorRegistry = () => {
    const operators = new Map<string, OperatorFunction>();

    return {
        register: (operator: string, fn: OperatorFunction): void => {
            operators.set(operator, fn);
        },

        evaluate: (operator: string, currentValue: string, conditionValue: string): boolean => {
            const fn = operators.get(operator);

            if (!fn) {
                console.warn(`Unknown Operator: ${operator}, defaulting to true`);

                return true;
            }

            return fn(currentValue, conditionValue);
        },

        has: (operator: string): boolean => operators.has(operator),
    };
};

export const operatorRegistry = createOperatorRegistry();
