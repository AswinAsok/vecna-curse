# Testing Business Rules - A Detailed Guide

## Table of Contents
1. [Project Setup Overview](#project-setup-overview)
2. [Understanding Business Rules Structure](#understanding-business-rules-structure)
3. [Creating Mock Data & Test Fixtures](#creating-mock-data--test-fixtures)
4. [Testing Rule Functions](#testing-rule-functions)
5. [Testing Rules with Dependencies](#testing-rules-with-dependencies)
6. [Testing the Registry](#testing-the-registry)
7. [Best Practices](#best-practices)
8. [Running Tests](#running-tests)
9. [Real-World Examples](#real-world-examples)

---

## Project Setup Overview

### Tech Stack
- **Test Framework**: Vitest (similar to Jest, but faster)
- **Test Utilities**: @testing-library/jest-dom for matchers
- **Coverage**: V8 coverage provider
- **Environment**: jsdom (for browser-like environment)

### File Naming Convention
- Test files should be named: `<filename>.test.ts`
- Place test files next to the source files or in a `__tests__` folder
- Example: `emailCountryRule.ts` → `emailCountryRule.test.ts`

### Import Pattern
```typescript
import { describe, expect, it } from "vitest";
import type { FormField } from "@/types/form.types";
import type { RuleContext } from "./rulesRegistry";
```

---

## Understanding Business Rules Structure

### Core Types

#### RuleContext
```typescript
interface RuleContext {
    field: FormField;              // The field being validated
    formData: Record<string, string>;  // All form data
    allFormFields: FormField[];    // All form fields
}
```

#### RuleFunction
```typescript
type RuleFunction = (context: RuleContext) => boolean;
```
- **Returns `true`**: Field should be validated
- **Returns `false`**: Field should NOT be validated (skip validation)

### Key Concepts
- **Business rules determine WHEN a field should be validated**
- They don't do the validation itself (validators do that)
- Example: "Email is required only when phone code is not +91"

---

## Creating Mock Data & Test Fixtures

### Mock FormField Template
```typescript
const mockFormField: FormField = {
    id: "1",
    type: "email",
    title: "Email",
    required: true,
    field_key: "email",
    hidden: false,
    unique: null,
    options: [],
    page_num: 1,
    property: {},
    conditions: {},
    team_field: false,
    description: null,
    placeholder: "Enter Email",
};
```

### Creating Variations
```typescript
// Phone field
const mockPhoneField: FormField = {
    ...mockFormField,
    id: "2",
    type: "phone",
    field_key: "phone",
    title: "Phone Number",
};

// Text field
const mockTextField: FormField = {
    ...mockFormField,
    id: "3",
    type: "text",
    field_key: "name",
};
```

### Mock Form Data
```typescript
const mockFormData: Record<string, string> = {
    email: "test@example.com",
    phone: "+919876543210",
    name: "John Doe",
};
```

### Mock RuleContext
```typescript
const mockContext: RuleContext = {
    field: mockFormField,
    formData: mockFormData,
    allFormFields: [mockFormField, mockPhoneField],
};
```

---

## Testing Rule Functions

### Basic Structure
```typescript
describe("emailRequiredForNonIndianPhone", () => {
    // Test 1: Rule returns true when condition is met
    it("should return true when phone code is not +91", () => {
        // Arrange - Set up test data
        const context: RuleContext = {
            field: mockEmailField,
            formData: {
                phone: "+14155552671", // US number
            },
            allFormFields: [mockEmailField, mockPhoneField],
        };

        // Act - Execute the rule
        const result = emailRequiredForNonIndianPhone(context);

        // Assert - Verify the result
        expect(result).toBe(true);
    });

    // Test 2: Rule returns false when condition is not met
    it("should return false when phone code is +91", () => {
        const context: RuleContext = {
            field: mockEmailField,
            formData: {
                phone: "+919876543210", // Indian number
            },
            allFormFields: [mockEmailField, mockPhoneField],
        };

        const result = emailRequiredForNonIndianPhone(context);

        expect(result).toBe(false);
    });
});
```

### Test Case Categories

#### 1. Happy Path (Expected Success Cases)
```typescript
it("should return true for UK phone number", () => {
    const context = createMockContext({ phone: "+447911123456" });
    expect(myRule(context)).toBe(true);
});
```

#### 2. Edge Cases
```typescript
it("should handle empty phone field", () => {
    const context = createMockContext({ phone: "" });
    expect(myRule(context)).toBe(false);
});

it("should handle missing phone field", () => {
    const context = createMockContext({});
    expect(myRule(context)).toBe(false);
});

it("should handle invalid phone format", () => {
    const context = createMockContext({ phone: "invalid" });
    expect(myRule(context)).toBe(false);
});
```

#### 3. Multiple Conditions
```typescript
it("should return true when ANY phone field is non-Indian", () => {
    const context: RuleContext = {
        field: mockEmailField,
        formData: {
            phone1: "+919876543210", // Indian
            phone2: "+14155552671",  // US
        },
        allFormFields: [
            { ...mockPhoneField, field_key: "phone1" },
            { ...mockPhoneField, field_key: "phone2" },
        ],
    };

    expect(myRule(context)).toBe(true);
});
```

---

## Testing Rules with Dependencies

### Mocking Dependencies

#### Option 1: Using vi.mock (Module-level mocking)
```typescript
import { vi } from "vitest";
import { extractCountryCode } from "@/utils/phoneUtils";

// Mock the entire module
vi.mock("@/utils/phoneUtils", () => ({
    extractCountryCode: vi.fn(),
}));

describe("emailRequiredForNonIndianPhone", () => {
    it("should use extractCountryCode correctly", () => {
        // Setup the mock return value
        vi.mocked(extractCountryCode).mockReturnValue("+1");

        const context = createMockContext({ phone: "+14155552671" });
        const result = emailRequiredForNonIndianPhone(context);

        // Verify the mock was called
        expect(extractCountryCode).toHaveBeenCalledWith("+14155552671");
        expect(result).toBe(true);
    });

    it("should handle +91 from extractCountryCode", () => {
        vi.mocked(extractCountryCode).mockReturnValue("+91");

        const context = createMockContext({ phone: "+919876543210" });
        const result = emailRequiredForNonIndianPhone(context);

        expect(result).toBe(false);
    });
});
```

#### Option 2: Testing with Real Dependencies (Integration-style)
```typescript
// No mocking - uses actual phoneUtils
import { extractCountryCode } from "@/utils/phoneUtils";

describe("emailRequiredForNonIndianPhone with real dependencies", () => {
    it("should work with actual country code extraction", () => {
        const context = createMockContext({ phone: "+14155552671" });
        const result = emailRequiredForNonIndianPhone(context);
        expect(result).toBe(true);
    });
});
```

**When to use each:**
- **Use mocks**: When testing logic in isolation, or when dependency is slow/complex
- **Use real dependencies**: For integration tests or when dependency is simple/fast

---

## Testing the Registry

### Testing Registration
```typescript
import { businessRuleRegistry } from "./rulesRegistry";

describe("businessRuleRegistry", () => {
    it("should register rules for a field", () => {
        const mockRule: RuleFunction = () => true;

        businessRuleRegistry.register("email", mockRule);

        // Verify it was registered by testing shouldValidate
        const context = createMockContext({ email: "test@example.com" });
        const result = businessRuleRegistry.shouldValidate(context);

        expect(result).toBe(true);
    });

    it("should return true when no rules are registered", () => {
        const context = createMockContext({ phone: "+919876543210" });

        // Field with no registered rules should always validate
        const result = businessRuleRegistry.shouldValidate(context);

        expect(result).toBe(true);
    });

    it("should run multiple rules with OR logic", () => {
        const rule1: RuleFunction = () => false;
        const rule2: RuleFunction = () => true;

        businessRuleRegistry.register("email", rule1);
        businessRuleRegistry.register("email", rule2);

        const context = createMockContext({ email: "test@example.com" });
        const result = businessRuleRegistry.shouldValidate(context);

        // Should return true if ANY rule returns true
        expect(result).toBe(true);
    });
});
```

### Testing createConditionalRule
```typescript
import { createConditionalRule } from "./createConditionalRule";

describe("createConditionalRule", () => {
    it("should create a rule that depends on another field", () => {
        const rule = createConditionalRule(
            "country",
            (value) => value === "USA"
        );

        const context: RuleContext = {
            field: mockEmailField,
            formData: { country: "USA" },
            allFormFields: [mockEmailField],
        };

        expect(rule(context)).toBe(true);
    });

    it("should return false when dependency condition not met", () => {
        const rule = createConditionalRule(
            "country",
            (value) => value === "USA"
        );

        const context: RuleContext = {
            field: mockEmailField,
            formData: { country: "India" },
            allFormFields: [mockEmailField],
        };

        expect(rule(context)).toBe(false);
    });

    it("should handle missing dependency field", () => {
        const rule = createConditionalRule(
            "country",
            (value) => value === "USA"
        );

        const context: RuleContext = {
            field: mockEmailField,
            formData: {}, // No country field
            allFormFields: [mockEmailField],
        };

        // undefined !== "USA" -> false
        expect(rule(context)).toBe(false);
    });
});
```

---

## Best Practices

### 1. Use Helper Functions
```typescript
// Create reusable test helpers
function createMockContext(
    formData: Record<string, string>,
    field: FormField = mockEmailField,
    allFormFields: FormField[] = [mockEmailField]
): RuleContext {
    return { field, formData, allFormFields };
}

// Use in tests
it("should work with US phone", () => {
    const context = createMockContext({ phone: "+14155552671" });
    expect(myRule(context)).toBe(true);
});
```

### 2. Test Naming Convention
```typescript
// Pattern: "should [expected behavior] when [condition]"
it("should return true when phone code is not +91")
it("should return false when all phones are Indian")
it("should handle empty phone field gracefully")
```

### 3. Arrange-Act-Assert Pattern
```typescript
it("should validate email for US phone", () => {
    // Arrange - Set up test data
    const context = createMockContext({ phone: "+14155552671" });

    // Act - Execute the function
    const result = emailRequiredForNonIndianPhone(context);

    // Assert - Verify expectations
    expect(result).toBe(true);
});
```

### 4. Test One Thing at a Time
```typescript
// Bad - testing multiple things
it("should handle all cases", () => {
    expect(rule(context1)).toBe(true);
    expect(rule(context2)).toBe(false);
    expect(rule(context3)).toBe(true);
});

// Good - separate tests
it("should return true for US phone", () => {
    expect(rule(usContext)).toBe(true);
});

it("should return false for Indian phone", () => {
    expect(rule(indianContext)).toBe(false);
});
```

### 5. Use Descriptive Variable Names
```typescript
// Bad
const c = { f: mockField, d: {}, a: [] };

// Good
const context = {
    field: mockEmailField,
    formData: {},
    allFormFields: [],
};
```

---

## Running Tests

### Commands
```bash
# Run all tests
npm test

# Run tests in watch mode (auto-reruns on file changes)
npm run test:watch

# Run with UI (visual interface)
npm run test:ui

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test emailCountryRule.test.ts

# Run tests matching pattern
npm test -- --grep="phone"
```

### Understanding Coverage
```bash
npm run test:coverage
```

**Coverage Metrics:**
- **Lines**: % of code lines executed
- **Functions**: % of functions called
- **Branches**: % of if/else paths taken
- **Statements**: % of statements executed

**Project Thresholds**: 80% for all metrics (see vitest.config.ts:22-27)

---

## Real-World Examples

### Example 1: Testing emailCountryRule.ts
```typescript
import { describe, expect, it } from "vitest";
import type { FormField } from "@/types/form.types";
import type { RuleContext } from "./rulesRegistry";
import { emailRequiredForNonIndianPhone } from "./emailCountryRule";

describe("emailRequiredForNonIndianPhone", () => {
    const mockEmailField: FormField = {
        id: "1",
        type: "email",
        title: "Email",
        required: true,
        field_key: "email",
        hidden: false,
        unique: null,
        options: [],
        page_num: 1,
        property: {},
        conditions: {},
        team_field: false,
        description: null,
        placeholder: "Enter Email",
    };

    const mockPhoneField: FormField = {
        ...mockEmailField,
        id: "2",
        type: "phone",
        field_key: "phone",
        title: "Phone",
    };

    function createContext(phoneValue: string): RuleContext {
        return {
            field: mockEmailField,
            formData: { phone: phoneValue },
            allFormFields: [mockEmailField, mockPhoneField],
        };
    }

    describe("Non-Indian phone numbers", () => {
        it("should return true for US phone number (+1)", () => {
            const context = createContext("+14155552671");
            expect(emailRequiredForNonIndianPhone(context)).toBe(true);
        });

        it("should return true for UK phone number (+44)", () => {
            const context = createContext("+447911123456");
            expect(emailRequiredForNonIndianPhone(context)).toBe(true);
        });

        it("should return true for Germany phone number (+49)", () => {
            const context = createContext("+4915234567890");
            expect(emailRequiredForNonIndianPhone(context)).toBe(true);
        });
    });

    describe("Indian phone numbers", () => {
        it("should return false for Indian phone number (+91)", () => {
            const context = createContext("+919876543210");
            expect(emailRequiredForNonIndianPhone(context)).toBe(false);
        });

        it("should return false for another Indian number", () => {
            const context = createContext("+918123456789");
            expect(emailRequiredForNonIndianPhone(context)).toBe(false);
        });
    });

    describe("Edge cases", () => {
        it("should return false when phone field is empty", () => {
            const context = createContext("");
            expect(emailRequiredForNonIndianPhone(context)).toBe(false);
        });

        it("should return false when no phone fields exist", () => {
            const context: RuleContext = {
                field: mockEmailField,
                formData: {},
                allFormFields: [mockEmailField], // No phone field
            };
            expect(emailRequiredForNonIndianPhone(context)).toBe(false);
        });

        it("should return true if ANY phone is non-Indian", () => {
            const context: RuleContext = {
                field: mockEmailField,
                formData: {
                    phone1: "+919876543210", // Indian
                    phone2: "+14155552671",  // US
                },
                allFormFields: [
                    mockEmailField,
                    { ...mockPhoneField, field_key: "phone1" },
                    { ...mockPhoneField, field_key: "phone2" },
                ],
            };
            expect(emailRequiredForNonIndianPhone(context)).toBe(true);
        });
    });
});
```

### Example 2: Testing a New Rule with Mocking
```typescript
import { describe, expect, it, vi, beforeEach } from "vitest";
import { checkAgeRequirement } from "./ageRule";
import { calculateAge } from "@/utils/dateUtils";

// Mock the dependency
vi.mock("@/utils/dateUtils");

describe("checkAgeRequirement", () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();
    });

    it("should return true when age is 18 or above", () => {
        // Mock calculateAge to return 18
        vi.mocked(calculateAge).mockReturnValue(18);

        const context = createMockContext({ dob: "2006-01-01" });
        const result = checkAgeRequirement(context);

        expect(calculateAge).toHaveBeenCalledWith("2006-01-01");
        expect(result).toBe(true);
    });

    it("should return false when age is below 18", () => {
        vi.mocked(calculateAge).mockReturnValue(15);

        const context = createMockContext({ dob: "2009-01-01" });
        const result = checkAgeRequirement(context);

        expect(result).toBe(false);
    });

    it("should handle invalid date gracefully", () => {
        vi.mocked(calculateAge).mockReturnValue(NaN);

        const context = createMockContext({ dob: "invalid" });
        const result = checkAgeRequirement(context);

        expect(result).toBe(false);
    });
});
```

---

## Quick Reference

### Common Matchers
```typescript
// Boolean
expect(value).toBe(true);
expect(value).toBe(false);

// Equality
expect(value).toBe(10);           // Strict equality (===)
expect(obj).toEqual({ a: 1 });    // Deep equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeDefined();
expect(value).toBeUndefined();
expect(value).toBeNull();

// Arrays
expect(array).toContain("value");
expect(array).toHaveLength(3);

// Functions
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith(arg1, arg2);
expect(fn).toHaveBeenCalledTimes(2);
```

### Test Structure Template
```typescript
import { describe, expect, it } from "vitest";
import type { RuleContext } from "./rulesRegistry";

describe("YourRuleName", () => {
    // Setup mock data
    const mockField = { /* ... */ };

    // Helper function
    function createContext(data: Record<string, string>): RuleContext {
        return {
            field: mockField,
            formData: data,
            allFormFields: [mockField],
        };
    }

    describe("When condition is met", () => {
        it("should return true", () => {
            const context = createContext({ /* ... */ });
            expect(yourRule(context)).toBe(true);
        });
    });

    describe("When condition is not met", () => {
        it("should return false", () => {
            const context = createContext({ /* ... */ });
            expect(yourRule(context)).toBe(false);
        });
    });

    describe("Edge cases", () => {
        it("should handle empty data", () => {
            const context = createContext({});
            expect(yourRule(context)).toBe(false);
        });
    });
});
```

---

## Troubleshooting

### Common Issues

#### Import Errors
```typescript
// Use @ alias for imports (configured in vitest.config.ts)
import { FormField } from "@/types/form.types";  // Good
import { FormField } from "../../../../types/form.types";  // Bad
```

#### Type Errors
```typescript
// Always import types explicitly
import type { FormField } from "@/types/form.types";
import type { RuleContext } from "./rulesRegistry";
```

#### Test Not Running
```bash
# Ensure file ends with .test.ts
emailCountryRule.test.ts  # Good
emailCountryRule.spec.ts  # Won't run (not in config)
```

---

## Next Steps

1. **Start Simple**: Test basic rules first
2. **Add Complexity**: Move to rules with dependencies
3. **Check Coverage**: Run `npm run test:coverage` regularly
4. **Refactor**: Extract common test utilities
5. **Document**: Add comments for complex test scenarios

Happy Testing! 🎯
