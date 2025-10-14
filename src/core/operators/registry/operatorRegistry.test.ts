import { beforeEach, describe, expect, it, vi } from "vitest";

import { operatorRegistry } from "./operatorRegistry";

describe("register", () => {
    beforeEach(() => {
        operatorRegistry.clear();
    });

    it("should register functions properly", () => {
        const greaterThan = vi.fn((current, condition) => current > condition);
        operatorRegistry.register(">", greaterThan);
        expect(operatorRegistry.count()).toBe(1);
    });

    it("should register mutliple operators", () => {
        const greaterThan = vi.fn((current, condition) => current > condition);
        const lesserThan = vi.fn((current, condition) => current < condition);

        operatorRegistry.register(">", greaterThan);
        operatorRegistry.register("<", lesserThan);
    });
});

describe("validate", () => {
    it("should return valid when no operators registered", () => {
        const result = operatorRegistry.evaluate("=", "test", "testing");
        expect(result).toBe(true);
    });

    it("ensure proper working when mutliple conditions are present", () => {
        const greaterThan = vi.fn((current, condition) => current > condition);
        const lesserThan = vi.fn((current, condition) => current < condition);
        const equals = vi.fn((current, condition) => current === condition);

        operatorRegistry.register(">", greaterThan);
        operatorRegistry.register("<", lesserThan);
        operatorRegistry.register("=", equals);

        expect(operatorRegistry.evaluate("<", "123", "12")).toBe(false);
        expect(operatorRegistry.evaluate("=", "123", "12")).toBe(false);
        expect(operatorRegistry.evaluate("=", "123", "123")).toBe(true);

        expect(lesserThan).toHaveBeenCalled();
        expect(equals).toHaveBeenCalled();
        expect(greaterThan).not.toHaveBeenCalled();
    });
});

describe("clear", () => {
    it("should clear all the validators", () => {
        const greaterThan = vi.fn((current, condition) => current > condition);
        const lesserThan = vi.fn((current, condition) => current < condition);
        const equals = vi.fn((current, condition) => current === condition);

        operatorRegistry.register(">", greaterThan);
        operatorRegistry.register("<", lesserThan);
        operatorRegistry.register("=", equals);

        operatorRegistry.clear();

        expect(operatorRegistry.count()).toBe(0);
    });
});
