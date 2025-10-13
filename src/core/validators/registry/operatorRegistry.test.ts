import { describe, it } from "node:test";

import { beforeEach, expect } from "vitest";

import { operatorRegistry } from "@/core/operators";

describe("operatorRegistry", () => {
    beforeEach(() => {
        const registry = operatorRegistry;
        registry.clear();
    });

    it("should register and evaluate equality operator", () => {
        operatorRegistry.register("=", (a, b) => a === b);

        const result = operatorRegistry.evaluate("=", "test", "test");
        expect(result).toBe(true);
    });

    it("should register and evaluate inequality operator", () => {
        operatorRegistry.register("!=", (a, b) => a !== b);

        const result = operatorRegistry.evaluate("!=", "test", "other");
        expect(result).toBe(true);
    });

    it("should return true for unknown operators with warning", () => {
        const resutlt = operatorRegistry.evaluate("unknown", "a", "b");
        expect(resutlt).toBe(true);
    });

    it("should check if operator exists", () => {
        operatorRegistry.register("exists", (a, b) => a === b);

        expect(operatorRegistry.has("exists")).toBe(true);
        expect(operatorRegistry.has("notexists")).toBe(false);
    });
});
