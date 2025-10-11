import type { TransformerFunction } from "./transformerRegistry";

export const trimTransformer: TransformerFunction = (formData) => {
    const trimmedData: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
        trimmedData[key] = typeof value === "string" ? value.trim() : value;
    });

    return trimmedData;
};
