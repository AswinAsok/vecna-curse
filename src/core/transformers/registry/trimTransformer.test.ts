import { describe, expect, it } from "vitest";

import { trimTransformer } from "./trimTransformer";

describe("trimTransformer", () => {
    it("should remove leading whitespaces", () => {
        const result = trimTransformer({
            name: "   hello",
        });
        expect(result.name).toBe("hello");
    });

    it("should remove trailing whitespace", () => {
        const result = trimTransformer({
            name: "   hello",
        });
        expect(result.name).toBe("hello");
    });

    it("should remove both leading and trailing whitespace", () => {
        const result = trimTransformer({
            name: "   hello   ",
        });
        expect(result.name).toBe("hello");
    });

    it("should preserve internal whitespace", () => {
        const result = trimTransformer({
            name: "   hello  world   ",
        });
        expect(result.name).toBe("hello  world");
    });

    it("should handle empty string", () => {
        const result = trimTransformer({
            name: "",
        });
        expect(result.name).toBe("");
    });
});
