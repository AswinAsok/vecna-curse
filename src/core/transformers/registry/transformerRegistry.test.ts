import { beforeEach, describe, expect, it, vi } from "vitest";

import { transformerRegistry } from "./transformerRegistry";

describe("TransformerRegistry", () => {
    beforeEach(() => {
        transformerRegistry.clear();
    });

    it("should register a transformer", () => {
        const transformer = vi.fn((formData) => formData);
        transformerRegistry.register(transformer);
        expect(transformerRegistry.count()).toBe(1);
    });

    it("should apply all registered transformers in order", () => {
        const trim = (formData: Record<string, string>) => {
            Object.entries(formData).forEach(([key, value]) => {
                formData[key] = value.trim();
            });
            return formData;
        };
        const upper = (formData: Record<string, string>) => {
            Object.entries(formData).forEach(([key, value]) => {
                formData[key] = value.toUpperCase();
            });
            return formData;
        };

        transformerRegistry.register(trim);
        transformerRegistry.register(upper);

        const result = transformerRegistry.transform({
            name: "  hello  ",
        });
        expect(result.name).toBe("HELLO");
    });

    it("should chain transformation", () => {
        const appendExclamation = (formData: Record<string, string>) => {
            Object.entries(formData).forEach(([key, value]) => {
                formData[key] = value + "!";
            });
            return formData;
        };

        transformerRegistry.register(appendExclamation);
        transformerRegistry.register(appendExclamation);

        const result = transformerRegistry.transform({
            name: "test",
        });

        expect(result.name).toBe("test!!");
    });
});
