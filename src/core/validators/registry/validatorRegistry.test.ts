import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockFormField } from "@/core/__tests__/helpers";

import { validatorRegistry } from "./validatorRegistry";

describe("ValidatorRegistry", () => {
    beforeEach(() => {
        validatorRegistry.clear();
    });

    describe("register", () => {
        it("should register a validator function", () => {
            const mockValidator = vi.fn(() => ({ isValid: true }));
            validatorRegistry.register(mockValidator);
            expect(validatorRegistry.count()).toBe(1);
        });

        it("should register multiple validators", () => {
            validatorRegistry.register(vi.fn(() => ({ isValid: true })));
            validatorRegistry.register(vi.fn(() => ({ isValid: true })));
            expect(validatorRegistry.count()).toBe(2);
        });
    });

    describe("validate", () => {
        it("should return valid when no validators registered", () => {
            const field = mockFormField();
            const result = validatorRegistry.validate(field, "test");
            expect(result.isValid).toBe(true);
        });

        it("should run all validators until one fails", () => {
            const validator1 = vi.fn(() => ({ isValid: true }));
            const validator2 = vi.fn(() => ({ isValid: false, error: "Error" }));
            const validator3 = vi.fn(() => ({ isValid: true }));

            validatorRegistry.register(validator1);
            validatorRegistry.register(validator2);
            validatorRegistry.register(validator3);

            const result = validatorRegistry.validate(mockFormField(), "test");

            expect(validator1).toHaveBeenCalled();
            expect(validator2).toHaveBeenCalled();
            expect(validator3).not.toHaveBeenCalled();

            expect(result.isValid).toBe(false);
        });

        it("should return the first error encountered", () => {
            const validator = vi.fn(() => ({
                isValid: false,
                error: "First Error",
            }));

            validatorRegistry.register(validator);

            const result = validatorRegistry.validate(mockFormField(), "");
            expect(result.error).toBe("First Error");
        });
    });

    describe("clear", () => {
        it("should clear all the validators", () => {
            const validator1 = vi.fn(() => ({ isValid: true }));
            const validator2 = vi.fn(() => ({ isValid: true }));

            validatorRegistry.register(validator1);
            validatorRegistry.register(validator2);

            validatorRegistry.clear();

            expect(validatorRegistry.count()).toBe(0);
        });
    });
});
