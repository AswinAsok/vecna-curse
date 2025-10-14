import { beforeEach, describe, expect, it } from "vitest";

import { registerDefaultBusinessRules } from "./registerDeafultRules";
import { businessRuleRegistry } from "./rulesRegistry";

describe("registerDefaultRules", () => {
    beforeEach(() => {
        businessRuleRegistry.clear();
    });

    it("should register email country rule", () => {
        registerDefaultBusinessRules();
        expect(businessRuleRegistry.has("email")).toBe(true);
    });

    it("should register all default rules", () => {
        registerDefaultBusinessRules();
        const ruleCount = businessRuleRegistry.count();
        expect(ruleCount).toBeGreaterThan(0);
    });
});
