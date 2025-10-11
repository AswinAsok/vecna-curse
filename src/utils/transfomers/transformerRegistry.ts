export type TransformerFunction = (formData: Record<string, string>) => Record<string, string>;

const createTransformerRegistry = () => {
    const transformers: TransformerFunction[] = [];

    return {
        register: (transformer: TransformerFunction): void => {
            transformers.push(transformer);
        },

        transform: (formData: Record<string, string>): Record<string, string> => {
            return transformers.reduce((data, transformer) => transformer(data), formData);
        },

        clear: (): void => {
            transformers.length = 0;
        },

        count: (): number => transformers.length,
    };
};

export const transformerRegistry = createTransformerRegistry();
