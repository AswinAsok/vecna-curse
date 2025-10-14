import { beforeEach, describe, expect, it } from "vitest";

import { mockFormField } from "@/core/__tests__/helpers";

import { registerDefaultValidators } from "./registerDeafultValidators";
import { validatorRegistry } from "./validatorRegistry";

describe("registerDefaultValidators", () => {
    beforeEach(() => {
        validatorRegistry.clear();
    });

    it("should register required validator", () => {
        registerDefaultValidators();
        expect(validatorRegistry.count()).toBeGreaterThan(0);
    });

    it("should register email validator", () => {
        registerDefaultValidators();
        const emailField = { ...mockFormField(), type: "email" };
        const result = validatorRegistry.validate(emailField, "invalid");
        expect(result.isValid).toBe(false);
    });

    it("should reigsiter validators in correct order", () => {
        registerDefaultValidators();
        const requiredField = { ...mockFormField(), required: true };
        const result = validatorRegistry.validate(requiredField, "");
        expect(result.error).toContain("required");
    });
});
