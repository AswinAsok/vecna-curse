import type { FormField } from "../../../services/types";

export type FieldComponent = (props: {
    field: FormField;
    value: string;
    handleInputChange: (key: string, value: string) => void;
}) => React.ReactElement | null;

const createFieldRegistry = () => {
    const registry = new Map<string, FieldComponent>();

    return {
        register: (type: string, component: FieldComponent): void => {
            registry.set(type, component);
        },

        registerMultiple: (types: string[], component: FieldComponent): void => {
            types.forEach((type) => registry.set(type, component));
        },

        get: (type: string): FieldComponent | undefined => {
            return registry.get(type);
        },

        has: (type: string): boolean => {
            return registry.has(type);
        },

        getRegisteredTypes: (): string[] => {
            return Array.from(registry.keys());
        },
    };
};

export const fieldRegistry = createFieldRegistry();
