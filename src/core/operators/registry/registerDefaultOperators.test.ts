import { beforeEach, describe, expect, it } from "vitest";

import { operatorRegistry } from "./operatorRegistry";
import { registerDefaultOperators } from "./registerDefaultOperators";

describe("registerDefaultOperators", () => {
    beforeEach(() => {
        operatorRegistry.clear();
    });

    it("should register all default operator", () => {
        registerDefaultOperators();
        expect(operatorRegistry.count()).toBeGreaterThan(0);
    });
});

describe("equals operator", () => {
    it("should evaluate equality correctly", () => {
        registerDefaultOperators();
        expect(operatorRegistry.evaluate("=", "test", "test")).toBe(true);
        expect(operatorRegistry.evaluate("=", "test", "others")).toBe(false);
    });
});

describe("noequals operator", () => {
    it("shoudl evaluate non-equality properly", () => {
        registerDefaultOperators();
        expect(operatorRegistry.evaluate("!=", "test", "testing")).toBe(true);
        expect(operatorRegistry.evaluate("=", "test", "test")).toBe(true);
    });
});
