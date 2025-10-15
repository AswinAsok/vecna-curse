import { beforeEach, describe, expect, it, vi } from "vitest";

import { transformerRegistry } from "../../../core/transformers";
import { transformFormData } from "./formDataTransformers";

vi.mock("../../../core/transformers", () => ({
    transformerRegistry: {
        transform: vi.fn(),
    },
}));

describe("transformFormData", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should call transformerRegistry.transform with the provided form data", () => {
        const mockFormData = { username: "testuser", email: "test@example.com" };
        const mockTransformedData = { username: "testuser", email: "test@example.com" };

        vi.mocked(transformerRegistry.transform).mockReturnValue(mockTransformedData);

        transformFormData(mockFormData);

        expect(transformerRegistry.transform).toHaveBeenCalledWith(mockFormData);
    });

    it("should return the transformed data from transformerRegistry", () => {
        const mockFormData = { instagram: "testuser" };
        const mockTransformedData = { instagram: "https://instagram.com/testuser" };

        vi.mocked(transformerRegistry.transform).mockReturnValue(mockTransformedData);

        const result = transformFormData(mockFormData);

        expect(result).toEqual(mockTransformedData);
    });

    it("should handle empty form data", () => {
        const emptyFormData = {};
        const mockTransformedData = {};

        vi.mocked(transformerRegistry.transform).mockReturnValue(mockTransformedData);

        const result = transformFormData(emptyFormData);

        expect(transformerRegistry.transform).toHaveBeenCalledWith(emptyFormData);
        expect(result).toEqual(mockTransformedData);
    });

    it("should handle form data with multiple fields", () => {
        const mockFormData = {
            name: "John Doe",
            instagram: "johndoe",
            email: "john@example.com",
        };
        const mockTransformedData = {
            name: "John Doe",
            instagram: "https://instagram.com/johndoe",
            email: "john@example.com",
        };

        vi.mocked(transformerRegistry.transform).mockReturnValue(mockTransformedData);

        const result = transformFormData(mockFormData);

        expect(transformerRegistry.transform).toHaveBeenCalledWith(mockFormData);
        expect(result).toEqual(mockTransformedData);
    });
});
