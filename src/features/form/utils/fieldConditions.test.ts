import { describe, expect, it } from "vitest";

import { registerDefaultOperators } from "@/core";
import { mockEventData, mockFormField } from "@/core/__tests__/helpers";

import { checkFieldConditions, doesFieldValidatesConditions } from "./fieldConditions";

describe("fieldConditions", () => {
    describe("checkFieldConditions", () => {
        registerDefaultOperators();

        it("should return true when no conditions", () => {
            const field = {
                ...mockFormField(),
                conditions: {},
            };
            const result = checkFieldConditions(field, {}, []);

            expect(result).toBe(true);
        });

        it("should evaluate equals condition", () => {
            const conditionField = {
                ...mockFormField(),
                id: "1",
                field_key: "country",
            };
            const targetField = {
                ...mockFormField(),
                id: "2",
                conditions: { field: "1", operator: "=", value: "USA" },
            };
            const result = checkFieldConditions(targetField, { country: "USA" }, [
                conditionField,
                targetField,
            ]);

            expect(result).toBe(true);
        });

        it("should return false when condition not met", () => {
            const conditionField = { ...mockFormField(), id: "1", field_key: "country" };
            const targetField = {
                ...mockFormField(),
                id: "2",
                conditions: { field: "1", operator: "=", value: "USA" },
            };

            const result = checkFieldConditions(targetField, { country: "India" }, [
                conditionField,
                targetField,
            ]);

            expect(result).toBe(false);
        });

        it("should handle missing referenced field", () => {
            const field = {
                ...mockFormField(),
                conditions: { field: "999", operator: "equals", value: "test" },
            };

            const result = checkFieldConditions(field, {}, []);
            expect(result).toBe(true); // Defaults to true
        });

        it("should handle empty form data", () => {
            const conditionField = { ...mockFormField(), id: "1", field_key: "country" };
            const targetField = {
                ...mockFormField(),
                conditions: { field: "1", operator: "=", value: "USA" },
            };

            const result = checkFieldConditions(targetField, {}, [conditionField]);
            expect(result).toBe(false); // Empty value doesn't equal "USA"
        });
    });

    describe("doesFieldValidatesConditions", () => {
        it("should validate field conditions", () => {
            const field = mockFormField();
            const eventData = {
                ...mockEventData(),
                form: [field],
            };

            const result = doesFieldValidatesConditions({
                field,
                formData: {},
                eventData,
            });

            expect(result).toBe(true);
        });

        it("should return false for hidden fields", () => {
            const field = { ...mockFormField(), hidden: true };
            const eventData = {
                ...mockEventData(),
                form: [field],
            };

            const result = doesFieldValidatesConditions({
                field,
                formData: {},
                eventData,
            });

            expect(result).toBe(false);
        });
    });
});
