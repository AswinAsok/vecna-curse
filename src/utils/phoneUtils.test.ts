import { describe, expect, it } from "vitest";

import { combinePhoneNumber, extractCountryCode, removeCountryCode } from "./phoneUtils";

describe("phoneUtils", () => {
    describe("extractCountryCode", () => {
        it("should extract +91 country code", () => {
            const result = extractCountryCode("+917485965410");
            expect(result).toBe("+91");
        });

        it("should extract US country code", () => {
            const result = extractCountryCode("+14155552671");
            expect(result).toBe("+1");
        });

        it("should default to +91 for invalid input", () => {
            const result = extractCountryCode("9685744585");
            expect(result).toBe("+91");
        });

        it("should handle empty string", () => {
            const result = extractCountryCode("");
            expect(result).toBe("+91");
        });
    });

    describe("removeCountryCode", () => {
        it("should remove Indian country Code", () => {
            const result = removeCountryCode("+919876543201");
            expect(result).toBe("9876543201");
        });

        it("should remove US country code", () => {
            const result = removeCountryCode("+14155552671");
            expect(result).toBe("4155552671");
        });

        it("should handle numbers without country code", () => {
            const result = removeCountryCode("9876543210");
            expect(result).toBe("9876543210");
        });

        it("should handle empty string", () => {
            const result = removeCountryCode("");
            expect(result).toBe("");
        });
    });

    describe("combinePhoneNumber", () => {
        it("should combine country code with phone number", () => {
            const result = combinePhoneNumber("+91", "9876543210");
            expect(result).toBe("+919876543210");
        });

        it("should handle US numbers", () => {
            const result = combinePhoneNumber("+1", "4155552671");
            expect(result).toBe("+14155552671");
        });

        it("should handle empty phone number", () => {
            const result = combinePhoneNumber("+91", "");
            expect(result).toBe("+91");
        });
    });
});
