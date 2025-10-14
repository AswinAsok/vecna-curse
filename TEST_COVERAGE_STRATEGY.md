# Comprehensive Test Coverage Strategy: Achieving 85% Coverage

## Table of Contents
1. [Overview](#overview)
2. [Current State](#current-state)
3. [Testing Tools & Setup](#testing-tools--setup)
4. [Testing Concepts Explained](#testing-concepts-explained)
5. [Module-by-Module Test Cases](#module-by-module-test-cases)
6. [Test Patterns & Best Practices](#test-patterns--best-practices)
7. [Coverage Metrics](#coverage-metrics)

---

## Overview

This document outlines a comprehensive strategy to achieve **85% test coverage** for the Vecna's Curse application. The application is a React-based event registration form built with TypeScript, Vite, and Vitest.

**Current Coverage**: 6.18% (lines/statements)
**Target Coverage**: 85% (lines, statements, functions, branches)
**Coverage Threshold (vitest.config.ts)**: 80% minimum

---

## Current State

### Existing Test Files
1. `src/core/validators/registry/emailValidator.test.ts` - Email validation tests
2. `src/core/validators/registry/requiredValidator.test.ts` - Required field validation tests
3. `src/core/validators/registry/operatorRegistry.test.ts` - Operator registry tests
4. `src/core/business-rules/rules/emailCountryRule.test.ts` - Business rule tests
5. `src/components/ui/Button/Button.test.tsx` - Button component tests
6. `src/components/ui/Button/Button.a11y.test.tsx` - Accessibility tests for Button

### Coverage Gaps
- **Features**: 0% coverage (event, form, success pages)
- **Core**: Partial coverage (~40% for validators, ~21% for business rules)
- **Components**: Only Button component tested
- **Hooks**: 0% coverage
- **Utils**: ~62% coverage (phoneUtils partially tested)
- **API**: 0% coverage
- **Transformers**: 0% coverage
- **Operators**: ~88% coverage

---

## Testing Tools & Setup

### Testing Stack
```json
{
  "vitest": "^3.2.4",              // Test runner (Jest alternative)
  "@vitest/ui": "^3.2.4",          // UI for test visualization
  "@vitest/coverage-v8": "^3.2.4", // Code coverage tool
  "@testing-library/react": "^16.3.0",      // React component testing
  "@testing-library/jest-dom": "^6.9.1",    // DOM matchers
  "@testing-library/user-event": "^14.6.1", // User interaction simulation
  "jsdom": "^27.0.0"               // DOM implementation for Node
}
```

### Configuration Files

#### vitest.config.ts
```typescript
export default defineConfig({
  test: {
    globals: true,           // Enable global test functions (describe, it, expect)
    environment: "jsdom",    // Browser-like environment for React
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",        // V8 coverage engine (fast)
      reporter: ["text", "json", "html"],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 }
    }
  }
});
```

#### src/test/setup.ts
```typescript
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

expect.extend(matchers);  // Adds DOM-specific matchers
afterEach(() => cleanup());  // Clean up after each test
```

---

## Testing Concepts Explained

### 1. Test Structure (Vitest/Jest)

#### `describe()` - Test Suite
Groups related tests together. Used to organize tests by feature or component.

```typescript
describe("EmailValidator", () => {
  // Multiple tests for email validation
});
```

#### `it()` / `test()` - Individual Test Case
Defines a single test. Use descriptive names starting with "should".

```typescript
it("should validate correct email addresses", () => {
  // Test implementation
});
```

#### `expect()` - Assertions
Verifies that values meet certain conditions.

```typescript
expect(result).toBe(true);           // Strict equality
expect(result.error).toBeUndefined(); // Check undefined
expect(array).toHaveLength(3);       // Array length
expect(element).toBeInTheDocument(); // DOM presence
```

### 2. Mock Functions (`vi.fn()`)

**Purpose**: Track function calls and control return values without executing real code.

```typescript
import { vi } from "vitest";

const mockFunction = vi.fn();           // Create mock
mockFunction("test");                   // Call mock
expect(mockFunction).toHaveBeenCalledWith("test"); // Verify call
expect(mockFunction).toHaveBeenCalledTimes(1);     // Verify call count
```

**Use Cases**:
- Testing callbacks (onClick, onChange)
- Mocking API calls
- Tracking function invocations

### 3. React Testing Library

#### `render()` - Mount Component
Renders a React component into the test DOM.

```typescript
import { render } from "@testing-library/react";

render(<Button onClick={handleClick}>Click Me</Button>);
```

#### `screen` - Query Rendered Output
Access rendered elements using queries.

```typescript
import { screen } from "@testing-library/react";

screen.getByText("Click Me");        // Find by visible text
screen.getByRole("button");          // Find by ARIA role
screen.getByPlaceholderText("Email"); // Find by placeholder
screen.queryByText("Optional");      // Returns null if not found
```

**Query Types**:
- `getBy*`: Throws error if not found (for elements that should exist)
- `queryBy*`: Returns null if not found (for elements that might not exist)
- `findBy*`: Returns promise (for async elements)

#### `userEvent` - Simulate User Interactions
Simulates realistic user behavior.

```typescript
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();
await user.click(button);            // Click element
await user.type(input, "Hello");     // Type text
await user.clear(input);             // Clear input
```

### 4. Testing Hooks (`renderHook`)

**Purpose**: Test React hooks in isolation.

```typescript
import { renderHook } from "@testing-library/react";

const { result } = renderHook(() => useFormState());
expect(result.current.formData).toEqual({});

// Test state updates
act(() => {
  result.current.updateField("name", "John");
});
expect(result.current.formData.name).toBe("John");
```

### 5. Mocking Modules (`vi.mock()`)

**Purpose**: Replace entire modules with mock implementations.

```typescript
vi.mock("@/lib/axios/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));
```

### 6. Test Lifecycle Hooks

```typescript
beforeAll(() => {
  // Runs once before all tests
});

beforeEach(() => {
  // Runs before each test
});

afterEach(() => {
  // Runs after each test
  vi.clearAllMocks(); // Clear mock history
});

afterAll(() => {
  // Runs once after all tests
});
```

### 7. Coverage Metrics

- **Lines**: Percentage of code lines executed
- **Statements**: Similar to lines but counts statements
- **Functions**: Percentage of functions called
- **Branches**: Percentage of conditional branches (if/else) tested

---

## Module-by-Module Test Cases

### 1. Core / Validators

#### 1.1 `validatorRegistry.ts` - Validator Registry System

**Purpose**: Central registry for managing validation functions.

**Test File**: `src/core/validators/registry/validatorRegistry.test.ts`

```typescript
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
      expect(validator3).not.toHaveBeenCalled(); // Short-circuits
      expect(result.isValid).toBe(false);
    });

    it("should return first error encountered", () => {
      const validator = vi.fn(() => ({
        isValid: false,
        error: "First error"
      }));
      validatorRegistry.register(validator);

      const result = validatorRegistry.validate(mockFormField(), "");
      expect(result.error).toBe("First error");
    });
  });

  describe("clear", () => {
    it("should remove all registered validators", () => {
      validatorRegistry.register(vi.fn(() => ({ isValid: true })));
      validatorRegistry.register(vi.fn(() => ({ isValid: true })));
      validatorRegistry.clear();
      expect(validatorRegistry.count()).toBe(0);
    });
  });
});
```

**New Concepts**:
- **`beforeEach()`**: Runs before each test to reset state
- **Short-circuiting**: Validators stop executing after first failure

---

#### 1.2 `createCustomValidator.ts` - Custom Validator Factory

**Purpose**: Creates validator functions with custom logic.

**Test File**: `src/core/validators/registry/createCustomValidator.test.ts`

```typescript
describe("createCustomValidator", () => {
  it("should create a validator that checks length", () => {
    const validator = createCustomValidator(
      (field, value) => value.length >= 5,
      "Must be at least 5 characters"
    );

    const result = validator(mockFormField(), "abc");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Must be at least 5 characters");
  });

  it("should pass validation when predicate returns true", () => {
    const validator = createCustomValidator(
      (field, value) => value === "valid",
      "Invalid value"
    );

    const result = validator(mockFormField(), "valid");
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("should handle undefined values", () => {
    const validator = createCustomValidator(
      (field, value) => value !== undefined,
      "Value required"
    );

    const result = validator(mockFormField(), undefined);
    expect(result.isValid).toBe(false);
  });
});
```

---

#### 1.3 `validators.ts` - Built-in Validators

**Purpose**: Common validation functions (minLength, maxLength, pattern, etc.).

**Test File**: `src/core/validators/registry/validators.test.ts`

```typescript
describe("Built-in Validators", () => {
  describe("minLengthValidator", () => {
    it("should validate minimum length", () => {
      const field = { ...mockFormField(), property: { min_length: 5 } };
      const result = minLengthValidator(field, "abc");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Minimum length is 5 characters");
    });

    it("should pass when length meets minimum", () => {
      const field = { ...mockFormField(), property: { min_length: 3 } };
      const result = minLengthValidator(field, "hello");
      expect(result.isValid).toBe(true);
    });

    it("should skip validation if no min_length property", () => {
      const result = minLengthValidator(mockFormField(), "ab");
      expect(result.isValid).toBe(true);
    });
  });

  describe("maxLengthValidator", () => {
    it("should validate maximum length", () => {
      const field = { ...mockFormField(), property: { max_length: 5 } };
      const result = maxLengthValidator(field, "toolongtext");
      expect(result.isValid).toBe(false);
    });
  });

  describe("patternValidator", () => {
    it("should validate against regex pattern", () => {
      const field = {
        ...mockFormField(),
        property: { pattern: "^[0-9]+$" }
      };
      const result = patternValidator(field, "abc123");
      expect(result.isValid).toBe(false);
    });

    it("should pass when value matches pattern", () => {
      const field = {
        ...mockFormField(),
        property: { pattern: "^[0-9]+$" }
      };
      const result = patternValidator(field, "12345");
      expect(result.isValid).toBe(true);
    });
  });
});
```

---

#### 1.4 `registerDefaultValidators.ts` - Validator Registration

**Purpose**: Registers all default validators on app startup.

**Test File**: `src/core/validators/registry/registerDefaultValidators.test.ts`

```typescript
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

  it("should register validators in correct order", () => {
    registerDefaultValidators();
    // Required validator should run before others
    const requiredField = { ...mockFormField(), required: true };
    const result = validatorRegistry.validate(requiredField, "");
    expect(result.error).toContain("required");
  });
});
```

---

### 2. Core / Operators

#### 2.1 `registerDefaultOperators.ts` - Operator Registration

**Purpose**: Registers comparison operators (equals, contains, greater_than, etc.).

**Test File**: `src/core/operators/registry/registerDefaultOperators.test.ts`

```typescript
describe("registerDefaultOperators", () => {
  beforeEach(() => {
    operatorRegistry.clear();
  });

  it("should register all default operators", () => {
    registerDefaultOperators();
    expect(operatorRegistry.count()).toBeGreaterThan(0);
  });

  describe("equals operator", () => {
    it("should evaluate equality correctly", () => {
      registerDefaultOperators();
      expect(operatorRegistry.evaluate("equals", "test", "test")).toBe(true);
      expect(operatorRegistry.evaluate("equals", "test", "other")).toBe(false);
    });
  });

  describe("contains operator", () => {
    it("should check if value contains substring", () => {
      registerDefaultOperators();
      expect(operatorRegistry.evaluate("contains", "hello world", "world")).toBe(true);
      expect(operatorRegistry.evaluate("contains", "hello", "world")).toBe(false);
    });
  });

  describe("greater_than operator", () => {
    it("should compare numeric values", () => {
      registerDefaultOperators();
      expect(operatorRegistry.evaluate("greater_than", "10", "5")).toBe(true);
      expect(operatorRegistry.evaluate("greater_than", "3", "5")).toBe(false);
    });
  });

  describe("less_than operator", () => {
    it("should compare numeric values", () => {
      registerDefaultOperators();
      expect(operatorRegistry.evaluate("less_than", "3", "5")).toBe(true);
    });
  });
});
```

---

### 3. Core / Transformers

#### 3.1 `trimTransformer.ts` - Trim Whitespace

**Purpose**: Removes leading/trailing whitespace from input values.

**Test File**: `src/core/transformers/registry/trimTransformer.test.ts`

```typescript
describe("trimTransformer", () => {
  it("should remove leading whitespace", () => {
    const result = trimTransformer(mockFormField(), "  hello");
    expect(result).toBe("hello");
  });

  it("should remove trailing whitespace", () => {
    const result = trimTransformer(mockFormField(), "hello  ");
    expect(result).toBe("hello");
  });

  it("should remove both leading and trailing whitespace", () => {
    const result = trimTransformer(mockFormField(), "  hello  ");
    expect(result).toBe("hello");
  });

  it("should preserve internal whitespace", () => {
    const result = trimTransformer(mockFormField(), "  hello  world  ");
    expect(result).toBe("hello  world");
  });

  it("should handle empty string", () => {
    const result = trimTransformer(mockFormField(), "");
    expect(result).toBe("");
  });

  it("should handle undefined", () => {
    const result = trimTransformer(mockFormField(), undefined);
    expect(result).toBe("");
  });
});
```

---

#### 3.2 `socialMediaTransformer.ts` - Extract Social Media Handles

**Purpose**: Extracts username from social media URLs.

**Test File**: `src/core/transformers/registry/socialMediaTransformer.test.ts`

```typescript
describe("socialMediaTransformer", () => {
  describe("Instagram", () => {
    it("should extract username from Instagram URL", () => {
      const field = { ...mockFormField(), field_key: "instagram" };
      const result = socialMediaTransformer(field, "https://instagram.com/johndoe");
      expect(result).toBe("johndoe");
    });

    it("should handle Instagram URL with trailing slash", () => {
      const field = { ...mockFormField(), field_key: "instagram" };
      const result = socialMediaTransformer(field, "https://instagram.com/johndoe/");
      expect(result).toBe("johndoe");
    });

    it("should keep plain username unchanged", () => {
      const field = { ...mockFormField(), field_key: "instagram" };
      const result = socialMediaTransformer(field, "johndoe");
      expect(result).toBe("johndoe");
    });
  });

  describe("Twitter/X", () => {
    it("should extract handle from Twitter URL", () => {
      const field = { ...mockFormField(), field_key: "twitter" };
      const result = socialMediaTransformer(field, "https://twitter.com/johndoe");
      expect(result).toBe("johndoe");
    });

    it("should extract handle from X.com URL", () => {
      const field = { ...mockFormField(), field_key: "twitter" };
      const result = socialMediaTransformer(field, "https://x.com/johndoe");
      expect(result).toBe("johndoe");
    });

    it("should remove @ symbol", () => {
      const field = { ...mockFormField(), field_key: "twitter" };
      const result = socialMediaTransformer(field, "@johndoe");
      expect(result).toBe("johndoe");
    });
  });

  describe("LinkedIn", () => {
    it("should extract username from LinkedIn URL", () => {
      const field = { ...mockFormField(), field_key: "linkedin" };
      const result = socialMediaTransformer(field, "https://linkedin.com/in/johndoe");
      expect(result).toBe("johndoe");
    });
  });

  describe("GitHub", () => {
    it("should extract username from GitHub URL", () => {
      const field = { ...mockFormField(), field_key: "github" };
      const result = socialMediaTransformer(field, "https://github.com/johndoe");
      expect(result).toBe("johndoe");
    });
  });

  it("should return original value for non-social fields", () => {
    const field = { ...mockFormField(), field_key: "email" };
    const result = socialMediaTransformer(field, "test@example.com");
    expect(result).toBe("test@example.com");
  });
});
```

---

#### 3.3 `transformerRegistry.ts` - Transformer Registry

**Purpose**: Manages transformation functions.

**Test File**: `src/core/transformers/registry/transformerRegistry.test.ts`

```typescript
describe("TransformerRegistry", () => {
  beforeEach(() => {
    transformerRegistry.clear();
  });

  it("should register a transformer", () => {
    const transformer = vi.fn((field, value) => value.toUpperCase());
    transformerRegistry.register(transformer);
    expect(transformerRegistry.count()).toBe(1);
  });

  it("should apply all registered transformers in order", () => {
    const trim = (field, value) => value.trim();
    const upper = (field, value) => value.toUpperCase();

    transformerRegistry.register(trim);
    transformerRegistry.register(upper);

    const result = transformerRegistry.transform(mockFormField(), "  hello  ");
    expect(result).toBe("HELLO");
  });

  it("should chain transformations", () => {
    transformerRegistry.register((f, v) => v + "!");
    transformerRegistry.register((f, v) => v + "!");

    const result = transformerRegistry.transform(mockFormField(), "test");
    expect(result).toBe("test!!");
  });
});
```

---

### 4. Core / Business Rules

#### 4.1 `rulesRegistry.ts` - Rules Registry System

**Purpose**: Manages conditional business rules that determine field requirements.

**Test File**: `src/core/business-rules/rules/rulesRegistry.test.ts`

```typescript
describe("RulesRegistry", () => {
  beforeEach(() => {
    rulesRegistry.clear();
  });

  it("should register a business rule", () => {
    const rule = vi.fn(() => true);
    rulesRegistry.register("email", rule);
    expect(rulesRegistry.hasRule("email")).toBe(true);
  });

  it("should evaluate registered rule", () => {
    const rule = vi.fn(() => true);
    rulesRegistry.register("email", rule);

    const context = mockRuleContext();
    const result = rulesRegistry.evaluate("email", context);

    expect(rule).toHaveBeenCalledWith(context);
    expect(result).toBe(true);
  });

  it("should return false for unregistered rules", () => {
    const result = rulesRegistry.evaluate("nonexistent", mockRuleContext());
    expect(result).toBe(false);
  });

  it("should allow multiple rules per field", () => {
    const rule1 = vi.fn(() => true);
    const rule2 = vi.fn(() => false);

    rulesRegistry.register("email", rule1);
    rulesRegistry.register("email", rule2);

    // Both rules should be evaluable
    expect(rulesRegistry.hasRule("email")).toBe(true);
  });
});
```

---

#### 4.2 `createConditionalRule.ts` - Conditional Rule Factory

**Purpose**: Creates rules based on field conditions.

**Test File**: `src/core/business-rules/rules/createConditionalRule.test.ts`

```typescript
describe("createConditionalRule", () => {
  it("should create rule that checks field conditions", () => {
    const rule = createConditionalRule({
      targetField: "country",
      operator: "equals",
      value: "USA"
    });

    const context = {
      field: mockFormField(),
      formData: { country: "USA" },
      allFormFields: []
    };

    expect(rule(context)).toBe(true);
  });

  it("should return false when condition not met", () => {
    const rule = createConditionalRule({
      targetField: "country",
      operator: "equals",
      value: "USA"
    });

    const context = {
      field: mockFormField(),
      formData: { country: "India" },
      allFormFields: []
    };

    expect(rule(context)).toBe(false);
  });

  it("should handle missing field data", () => {
    const rule = createConditionalRule({
      targetField: "country",
      operator: "equals",
      value: "USA"
    });

    const context = {
      field: mockFormField(),
      formData: {},
      allFormFields: []
    };

    expect(rule(context)).toBe(false);
  });
});
```

---

#### 4.3 `registerDefaultRules.ts` - Rule Registration

**Purpose**: Registers all business rules on startup.

**Test File**: `src/core/business-rules/rules/registerDefaultRules.test.ts`

```typescript
describe("registerDefaultRules", () => {
  beforeEach(() => {
    rulesRegistry.clear();
  });

  it("should register email country rule", () => {
    registerDefaultRules();
    expect(rulesRegistry.hasRule("email")).toBe(true);
  });

  it("should register all default rules", () => {
    registerDefaultRules();
    const ruleCount = rulesRegistry.count();
    expect(ruleCount).toBeGreaterThan(0);
  });
});
```

---

### 5. Utils / phoneUtils.ts

**Purpose**: Phone number formatting utilities.

**Test File**: `src/utils/phoneUtils.test.ts`

```typescript
describe("phoneUtils", () => {
  describe("extractCountryCode", () => {
    it("should extract +91 country code", () => {
      const result = extractCountryCode("+919876543210");
      expect(result).toBe("+91");
    });

    it("should extract US country code", () => {
      const result = extractCountryCode("+14155552671");
      expect(result).toBe("+1");
    });

    it("should default to +91 for invalid input", () => {
      const result = extractCountryCode("9876543210");
      expect(result).toBe("+91");
    });

    it("should handle empty string", () => {
      const result = extractCountryCode("");
      expect(result).toBe("+91");
    });

    it("should extract longest matching country code", () => {
      // Test case for codes like +1 vs +1-242
      const result = extractCountryCode("+1242");
      expect(result).toBe("+1242" || "+1"); // Depends on country codes data
    });
  });

  describe("removeCountryCode", () => {
    it("should remove Indian country code", () => {
      const result = removeCountryCode("+919876543210");
      expect(result).toBe("9876543210");
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
```

---

### 6. Features / Form

#### 6.1 Hooks Testing

##### 6.1.1 `useFormState.ts` - Form State Management

**Test File**: `src/features/form/hooks/useFormState.test.ts`

```typescript
import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useFormState } from "./useFormState";

describe("useFormState", () => {
  it("should initialize with empty form data", () => {
    const { result } = renderHook(() => useFormState());
    expect(result.current.formData).toEqual({});
  });

  it("should update field value", () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.updateField("name", "John Doe");
    });

    expect(result.current.formData.name).toBe("John Doe");
  });

  it("should update multiple fields", () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.updateField("name", "John");
      result.current.updateField("email", "john@example.com");
    });

    expect(result.current.formData).toEqual({
      name: "John",
      email: "john@example.com"
    });
  });

  it("should overwrite existing field value", () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.updateField("name", "John");
      result.current.updateField("name", "Jane");
    });

    expect(result.current.formData.name).toBe("Jane");
  });

  it("should set entire form data", () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.setFormData({ name: "John", age: "25" });
    });

    expect(result.current.formData).toEqual({ name: "John", age: "25" });
  });

  it("should reset form to empty state", () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.updateField("name", "John");
      result.current.updateField("email", "john@example.com");
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual({});
  });

  it("should preserve other fields when updating one field", () => {
    const { result } = renderHook(() => useFormState());

    act(() => {
      result.current.updateField("name", "John");
      result.current.updateField("email", "john@example.com");
      result.current.updateField("name", "Jane");
    });

    expect(result.current.formData).toEqual({
      name: "Jane",
      email: "john@example.com"
    });
  });
});
```

**New Concepts**:
- **`renderHook()`**: Renders a hook in a test environment
- **`act()`**: Wraps state updates to ensure React processes them
- **`result.current`**: Access current return value of the hook

---

##### 6.1.2 `useDebouncedEffect.ts` - Debounced Side Effects

**Test File**: `src/features/form/hooks/useDebouncedEffect.test.ts`

```typescript
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useDebouncedEffect } from "./useDebouncedEffect";

describe("useDebouncedEffect", () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Mock timers
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should not call callback immediately", () => {
    const callback = vi.fn();
    renderHook(() => useDebouncedEffect(callback, [], 500));

    expect(callback).not.toHaveBeenCalled();
  });

  it("should call callback after delay", () => {
    const callback = vi.fn();
    renderHook(() => useDebouncedEffect(callback, [], 500));

    vi.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should cancel previous timeout on re-render", () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useDebouncedEffect(callback, [value], 500),
      { initialProps: { value: "a" } }
    );

    vi.advanceTimersByTime(300);
    rerender({ value: "b" }); // Should cancel first timeout
    vi.advanceTimersByTime(300);

    expect(callback).not.toHaveBeenCalled(); // Total 600ms but reset

    vi.advanceTimersByTime(200); // Complete second timeout
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should cleanup timeout on unmount", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() =>
      useDebouncedEffect(callback, [], 500)
    );

    unmount();
    vi.advanceTimersByTime(500);

    expect(callback).not.toHaveBeenCalled();
  });
});
```

**New Concepts**:
- **`vi.useFakeTimers()`**: Mock time-based functions (setTimeout, setInterval)
- **`vi.advanceTimersByTime()`**: Fast-forward time
- **`rerender()`**: Re-render hook with new props
- **`unmount()`**: Clean up hook

---

##### 6.1.3 `usePagination.hook.ts` - Pagination Logic

**Test File**: `src/features/form/hooks/usePagination.hook.test.ts`

```typescript
describe("usePagination", () => {
  const mockFields = [
    { ...mockFormField(), page_num: 1, id: "1" },
    { ...mockFormField(), page_num: 1, id: "2" },
    { ...mockFormField(), page_num: 2, id: "3" },
  ];

  it("should initialize with first page", () => {
    const { result } = renderHook(() =>
      usePagination(mockFields, {})
    );
    expect(result.current.currentPage).toBe(1);
  });

  it("should return fields for current page only", () => {
    const { result } = renderHook(() =>
      usePagination(mockFields, {})
    );
    expect(result.current.currentPageFields).toHaveLength(2);
    expect(result.current.currentPageFields[0].id).toBe("1");
  });

  it("should navigate to next page", () => {
    const { result } = renderHook(() =>
      usePagination(mockFields, {})
    );

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentPageFields).toHaveLength(1);
  });

  it("should navigate to previous page", () => {
    const { result } = renderHook(() =>
      usePagination(mockFields, {})
    );

    act(() => {
      result.current.nextPage();
      result.current.prevPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it("should not go below page 1", () => {
    const { result } = renderHook(() =>
      usePagination(mockFields, {})
    );

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it("should not exceed total pages", () => {
    const { result } = renderHook(() =>
      usePagination(mockFields, {})
    );

    act(() => {
      result.current.nextPage();
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(2); // Max page
  });

  it("should calculate total pages correctly", () => {
    const { result } = renderHook(() =>
      usePagination(mockFields, {})
    );
    expect(result.current.totalPages).toBe(2);
  });

  it("should filter hidden fields from page", () => {
    const fieldsWithHidden = [
      { ...mockFormField(), page_num: 1, id: "1", hidden: false },
      { ...mockFormField(), page_num: 1, id: "2", hidden: true },
    ];

    const { result } = renderHook(() =>
      usePagination(fieldsWithHidden, {})
    );

    expect(result.current.currentPageFields).toHaveLength(1);
  });
});
```

---

##### 6.1.4 `useFormValidation.hook.ts` - Form Validation Hook

**Test File**: `src/features/form/hooks/useFormValidation.hook.test.ts`

```typescript
describe("useFormValidation", () => {
  const mockField = mockFormField();

  it("should validate required fields", () => {
    const { result } = renderHook(() => useFormValidation());

    const errors = result.current.validatePage(
      [{ ...mockField, required: true }],
      {}
    );

    expect(errors[mockField.field_key]).toBeDefined();
  });

  it("should not show errors for optional empty fields", () => {
    const { result } = renderHook(() => useFormValidation());

    const errors = result.current.validatePage(
      [{ ...mockField, required: false }],
      {}
    );

    expect(errors[mockField.field_key]).toBeUndefined();
  });

  it("should validate email format", () => {
    const { result } = renderHook(() => useFormValidation());

    const errors = result.current.validatePage(
      [{ ...mockField, type: "email", required: true }],
      { [mockField.field_key]: "invalid-email" }
    );

    expect(errors[mockField.field_key]).toContain("email");
  });

  it("should return empty errors for valid data", () => {
    const { result } = renderHook(() => useFormValidation());

    const errors = result.current.validatePage(
      [{ ...mockField, required: true }],
      { [mockField.field_key]: "valid value" }
    );

    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("should validate multiple fields", () => {
    const { result } = renderHook(() => useFormValidation());

    const fields = [
      { ...mockField, id: "1", field_key: "name", required: true },
      { ...mockField, id: "2", field_key: "email", type: "email", required: true },
    ];

    const errors = result.current.validatePage(fields, {});

    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
  });
});
```

---

##### 6.1.5 `useSubmissionState.ts` - Submission State Management

**Test File**: `src/features/form/hooks/useSubmissionState.test.ts`

```typescript
describe("useSubmissionState", () => {
  it("should initialize with not submitting state", () => {
    const { result } = renderHook(() => useSubmissionState());
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.submitSuccess).toBe(false);
  });

  it("should set submitting state", () => {
    const { result } = renderHook(() => useSubmissionState());

    act(() => {
      result.current.setSubmitting(true);
    });

    expect(result.current.isSubmitting).toBe(true);
  });

  it("should set success state", () => {
    const { result } = renderHook(() => useSubmissionState());

    act(() => {
      result.current.setSuccess(true);
    });

    expect(result.current.submitSuccess).toBe(true);
  });

  it("should set error message", () => {
    const { result } = renderHook(() => useSubmissionState());

    act(() => {
      result.current.setError("Submission failed");
    });

    expect(result.current.error).toBe("Submission failed");
  });

  it("should clear error", () => {
    const { result } = renderHook(() => useSubmissionState());

    act(() => {
      result.current.setError("Error");
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it("should reset all state", () => {
    const { result } = renderHook(() => useSubmissionState());

    act(() => {
      result.current.setSubmitting(true);
      result.current.setSuccess(true);
      result.current.setError("Error");
      result.current.reset();
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.submitSuccess).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
```

---

##### 6.1.6 `useFormErrorHandler.ts` - Error Handling Hook

**Test File**: `src/features/form/hooks/useFormErrorHandler.test.ts`

```typescript
import { renderHook } from "@testing-library/react";
import toast from "react-hot-toast";
import { describe, expect, it, vi } from "vitest";
import { useFormErrorHandler } from "./useFormErrorHandler";

vi.mock("react-hot-toast");

describe("useFormErrorHandler", () => {
  it("should display validation errors", () => {
    const { result } = renderHook(() => useFormErrorHandler());

    const errors = { name: "Name is required", email: "Invalid email" };
    result.current.handleValidationErrors(errors);

    expect(toast.error).toHaveBeenCalledWith("Name is required");
  });

  it("should display API error messages", () => {
    const { result } = renderHook(() => useFormErrorHandler());

    const apiError = new Error("Network error");
    result.current.handleApiError(apiError);

    expect(toast.error).toHaveBeenCalled();
  });

  it("should display custom error message", () => {
    const { result } = renderHook(() => useFormErrorHandler());

    result.current.showError("Custom error");

    expect(toast.error).toHaveBeenCalledWith("Custom error");
  });

  it("should clear all errors", () => {
    const { result } = renderHook(() => useFormErrorHandler());

    result.current.clearErrors();

    expect(toast.dismiss).toHaveBeenCalled();
  });
});
```

**New Concepts**:
- **`vi.mock()`**: Mock entire module
- **Module mocking**: Replace real implementations with test doubles

---

#### 6.2 Utils Testing

##### 6.2.1 `fieldConditions.ts` - Conditional Field Logic

**Test File**: `src/features/form/utils/fieldConditions.test.ts`

```typescript
describe("fieldConditions", () => {
  describe("checkFieldConditions", () => {
    it("should return true when no conditions", () => {
      const field = { ...mockFormField(), conditions: {} };
      const result = checkFieldConditions(field, {}, []);
      expect(result).toBe(true);
    });

    it("should evaluate equals condition", () => {
      const conditionField = { ...mockFormField(), id: "1", field_key: "country" };
      const targetField = {
        ...mockFormField(),
        id: "2",
        conditions: { field: "1", operator: "equals", value: "USA" }
      };

      const result = checkFieldConditions(
        targetField,
        { country: "USA" },
        [conditionField, targetField]
      );

      expect(result).toBe(true);
    });

    it("should return false when condition not met", () => {
      const conditionField = { ...mockFormField(), id: "1", field_key: "country" };
      const targetField = {
        ...mockFormField(),
        id: "2",
        conditions: { field: "1", operator: "equals", value: "USA" }
      };

      const result = checkFieldConditions(
        targetField,
        { country: "India" },
        [conditionField, targetField]
      );

      expect(result).toBe(false);
    });

    it("should handle missing referenced field", () => {
      const field = {
        ...mockFormField(),
        conditions: { field: "999", operator: "equals", value: "test" }
      };

      const result = checkFieldConditions(field, {}, []);
      expect(result).toBe(true); // Defaults to true
    });

    it("should handle empty form data", () => {
      const conditionField = { ...mockFormField(), id: "1", field_key: "country" };
      const targetField = {
        ...mockFormField(),
        conditions: { field: "1", operator: "equals", value: "USA" }
      };

      const result = checkFieldConditions(targetField, {}, [conditionField]);
      expect(result).toBe(false); // Empty value doesn't equal "USA"
    });
  });

  describe("doesFieldValidatesConditions", () => {
    it("should validate field conditions", () => {
      const field = mockFormField();
      const eventData = {
        form: [field],
        // ... other event data
      };

      const result = doesFieldValidatesConditions({
        field,
        formData: {},
        eventData
      });

      expect(result).toBe(true);
    });

    it("should return false for hidden fields", () => {
      const field = { ...mockFormField(), hidden: true };
      const eventData = { form: [field] };

      const result = doesFieldValidatesConditions({
        field,
        formData: {},
        eventData
      });

      expect(result).toBe(false);
    });
  });
});
```

---

##### 6.2.2 `prepareLogData.ts` - Form Log Preparation

**Test File**: `src/features/form/utils/prepareLogData.test.ts`

```typescript
describe("prepareLogData", () => {
  it("should prepare log data with form responses", () => {
    const formData = { name: "John", email: "john@example.com" };
    const eventId = "event123";

    const result = prepareLogData(formData, eventId);

    expect(result.eventId).toBe(eventId);
    expect(result.responses).toEqual(formData);
  });

  it("should include timestamp", () => {
    const result = prepareLogData({}, "event123");
    expect(result.timestamp).toBeDefined();
    expect(typeof result.timestamp).toBe("number");
  });

  it("should handle empty form data", () => {
    const result = prepareLogData({}, "event123");
    expect(result.responses).toEqual({});
  });

  it("should serialize complex values", () => {
    const formData = {
      name: "John",
      preferences: JSON.stringify({ newsletter: true })
    };

    const result = prepareLogData(formData, "event123");
    expect(result.responses.preferences).toBeDefined();
  });
});
```

---

##### 6.2.3 `prepareSubmitData.ts` - Submission Data Preparation

**Test File**: `src/features/form/utils/prepareSubmitData.test.ts`

```typescript
describe("prepareSubmitData", () => {
  it("should prepare submission data", () => {
    const formData = { name: "John", email: "john@example.com" };
    const eventData = mockEventData();

    const result = prepareSubmitData(formData, eventData);

    expect(result.responses).toEqual(formData);
    expect(result.eventId).toBe(eventData.id);
  });

  it("should include ticket information", () => {
    const formData = { ticket_id: "ticket123" };
    const eventData = mockEventData();

    const result = prepareSubmitData(formData, eventData);

    expect(result.ticketId).toBe("ticket123");
  });

  it("should apply transformations", () => {
    const formData = { name: "  John  " };
    const eventData = mockEventData();

    const result = prepareSubmitData(formData, eventData);

    expect(result.responses.name).toBe("John"); // Trimmed
  });

  it("should filter hidden fields", () => {
    const formData = {
      name: "John",
      hidden_field: "secret"
    };
    const eventData = {
      ...mockEventData(),
      form: [
        { ...mockFormField(), field_key: "name", hidden: false },
        { ...mockFormField(), field_key: "hidden_field", hidden: true }
      ]
    };

    const result = prepareSubmitData(formData, eventData);

    expect(result.responses.name).toBeDefined();
    expect(result.responses.hidden_field).toBeUndefined();
  });
});
```

---

##### 6.2.4 `ticketMapping.ts` - Ticket Selection Logic

**Test File**: `src/features/form/utils/ticketMapping.test.ts`

```typescript
describe("ticketMapping", () => {
  it("should map form field to ticket field", () => {
    const mapping = { form_field: "ticket_id", ticket_field: "id" };
    const result = mapTicketField("ticket123", mapping);
    expect(result).toBe("ticket123");
  });

  it("should extract ticket information", () => {
    const formData = { ticket_id: "ticket123" };
    const tickets = [
      { id: "ticket123", name: "VIP Pass", price: 100 }
    ];

    const result = getSelectedTicket(formData, tickets);

    expect(result.name).toBe("VIP Pass");
    expect(result.price).toBe(100);
  });

  it("should return null for invalid ticket", () => {
    const formData = { ticket_id: "invalid" };
    const tickets = [{ id: "ticket123", name: "VIP Pass" }];

    const result = getSelectedTicket(formData, tickets);

    expect(result).toBeNull();
  });
});
```

---

##### 6.2.5 `formDataTransformers.ts` - Data Transformation

**Test File**: `src/features/form/utils/formDataTransformers.test.ts`

```typescript
describe("formDataTransformers", () => {
  it("should apply all registered transformers", () => {
    const formData = { name: "  John  ", email: "  test@example.com  " };
    const fields = [
      mockFormField(),
      { ...mockFormField(), field_key: "email" }
    ];

    const result = applyTransformers(formData, fields);

    expect(result.name).toBe("John");
    expect(result.email).toBe("test@example.com");
  });

  it("should handle social media transformations", () => {
    const formData = {
      instagram: "https://instagram.com/johndoe",
      twitter: "@johndoe"
    };
    const fields = [
      { ...mockFormField(), field_key: "instagram" },
      { ...mockFormField(), field_key: "twitter" }
    ];

    const result = applyTransformers(formData, fields);

    expect(result.instagram).toBe("johndoe");
    expect(result.twitter).toBe("johndoe");
  });

  it("should skip transformation for undefined values", () => {
    const formData = { name: undefined };
    const result = applyTransformers(formData, [mockFormField()]);
    expect(result.name).toBeUndefined();
  });
});
```

---

#### 6.3 API Testing

##### 6.3.1 `formSubmissionApi.ts` - Form Submission API

**Test File**: `src/features/form/api/formSubmissionApi.test.ts`

```typescript
import { apiClient } from "@/lib/axios/client";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { submitForm } from "./formSubmissionApi";

vi.mock("@/lib/axios/client");

describe("formSubmissionApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("submitForm", () => {
    it("should submit form data successfully", async () => {
      const mockResponse = { data: { id: "submission123", status: "success" } };
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const formData = { name: "John", email: "john@example.com" };
      const eventId = "event123";

      const result = await submitForm(eventId, formData);

      expect(apiClient.post).toHaveBeenCalledWith(
        `/events/${eventId}/submit`,
        formData
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle submission errors", async () => {
      const error = new Error("Network error");
      vi.mocked(apiClient.post).mockRejectedValue(error);

      await expect(submitForm("event123", {})).rejects.toThrow("Network error");
    });

    it("should include auth token in headers", async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

      await submitForm("event123", {}, "auth-token");

      expect(apiClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        { headers: { Authorization: "Bearer auth-token" } }
      );
    });

    it("should validate event ID", async () => {
      await expect(submitForm("", {})).rejects.toThrow("Event ID required");
    });

    it("should validate form data", async () => {
      await expect(submitForm("event123", null)).rejects.toThrow();
    });
  });
});
```

**New Concepts**:
- **`vi.mocked()`**: Type-safe access to mocked functions
- **`mockResolvedValue()`**: Mock successful async calls
- **`mockRejectedValue()`**: Mock failed async calls
- **`expect.any(Type)`**: Match any value of type

---

##### 6.3.2 `formLogApi.ts` - Form Log API

**Test File**: `src/features/form/api/formLogApi.test.ts`

```typescript
vi.mock("@/lib/axios/client");

describe("formLogApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createFormLog", () => {
    it("should create form log", async () => {
      const mockResponse = { data: { logId: "log123" } };
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const logData = { eventId: "event123", responses: {} };
      const result = await createFormLog(logData);

      expect(apiClient.post).toHaveBeenCalledWith("/logs", logData);
      expect(result.logId).toBe("log123");
    });
  });

  describe("updateFormLog", () => {
    it("should update existing log", async () => {
      vi.mocked(apiClient.patch).mockResolvedValue({ data: {} });

      await updateFormLog("log123", { responses: { name: "John" } });

      expect(apiClient.patch).toHaveBeenCalledWith(
        "/logs/log123",
        { responses: { name: "John" } }
      );
    });

    it("should handle update errors", async () => {
      vi.mocked(apiClient.patch).mockRejectedValue(new Error("Not found"));

      await expect(updateFormLog("invalid", {})).rejects.toThrow("Not found");
    });
  });

  describe("getFormLog", () => {
    it("should retrieve form log", async () => {
      const mockLog = { logId: "log123", responses: {} };
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockLog });

      const result = await getFormLog("log123");

      expect(result).toEqual(mockLog);
    });
  });
});
```

---

#### 6.4 Component Testing

##### 6.4.1 Field Components

###### 6.4.1.1 `TextField.tsx` - Text Input Field

**Test File**: `src/features/form/components/fields/TextField.test.tsx`

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextField } from "./TextField";

describe("TextField", () => {
  const mockField = {
    ...mockFormField(),
    type: "text",
    placeholder: "Enter name"
  };

  it("should render text input", () => {
    render(
      <TextField
        field={mockField}
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
  });

  it("should display current value", () => {
    render(
      <TextField
        field={mockField}
        value="John Doe"
        onChange={() => {}}
      />
    );

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
  });

  it("should call onChange when typing", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <TextField
        field={mockField}
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByPlaceholderText("Enter name");
    await user.type(input, "John");

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenLastCalledWith("John");
  });

  it("should show error message", () => {
    render(
      <TextField
        field={mockField}
        value=""
        onChange={() => {}}
        error="This field is required"
      />
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("should apply error styling when error present", () => {
    render(
      <TextField
        field={mockField}
        value=""
        onChange={() => {}}
        error="Error"
      />
    );

    const input = screen.getByPlaceholderText("Enter name");
    expect(input).toHaveClass("error"); // Adjust based on actual class
  });

  it("should be disabled when disabled prop is true", () => {
    render(
      <TextField
        field={mockField}
        value=""
        onChange={() => {}}
        disabled
      />
    );

    expect(screen.getByPlaceholderText("Enter name")).toBeDisabled();
  });

  it("should show required indicator for required fields", () => {
    const requiredField = { ...mockField, required: true };
    render(
      <TextField
        field={requiredField}
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("should respect maxLength property", () => {
    const fieldWithMax = {
      ...mockField,
      property: { max_length: 10 }
    };

    render(
      <TextField
        field={fieldWithMax}
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText("Enter name");
    expect(input).toHaveAttribute("maxLength", "10");
  });
});
```

---

###### 6.4.1.2 `SelectField.tsx` - Select Dropdown

**Test File**: `src/features/form/components/fields/SelectField.test.tsx`

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SelectField } from "./SelectField";

describe("SelectField", () => {
  const mockField = {
    ...mockFormField(),
    type: "select",
    options: [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" }
    ]
  };

  it("should render select dropdown", () => {
    render(
      <SelectField
        field={mockField}
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("should display all options", async () => {
    const user = userEvent.setup();
    render(
      <SelectField
        field={mockField}
        value=""
        onChange={() => {}}
      />
    );

    const select = screen.getByRole("combobox");
    await user.click(select);

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("should call onChange when option selected", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SelectField
        field={mockField}
        value=""
        onChange={handleChange}
      />
    );

    const select = screen.getByRole("combobox");
    await user.click(select);
    await user.click(screen.getByText("Option 1"));

    expect(handleChange).toHaveBeenCalledWith("opt1");
  });

  it("should show selected value", () => {
    render(
      <SelectField
        field={mockField}
        value="opt1"
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("should show placeholder when no value", () => {
    const fieldWithPlaceholder = {
      ...mockField,
      placeholder: "Select an option"
    };

    render(
      <SelectField
        field={fieldWithPlaceholder}
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });
});
```

---

###### 6.4.1.3 `CheckboxField.tsx` - Checkbox Input

**Test File**: `src/features/form/components/fields/CheckboxField.test.tsx`

```typescript
describe("CheckboxField", () => {
  const mockField = {
    ...mockFormField(),
    type: "checkbox",
    options: [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" }
    ]
  };

  it("should render all checkbox options", () => {
    render(
      <CheckboxField
        field={mockField}
        value={[]}
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
  });

  it("should check selected options", () => {
    render(
      <CheckboxField
        field={mockField}
        value={["opt1"]}
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText("Option 1")).toBeChecked();
    expect(screen.getByLabelText("Option 2")).not.toBeChecked();
  });

  it("should call onChange when checkbox clicked", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <CheckboxField
        field={mockField}
        value={[]}
        onChange={handleChange}
      />
    );

    await user.click(screen.getByLabelText("Option 1"));

    expect(handleChange).toHaveBeenCalledWith(["opt1"]);
  });

  it("should add value when checking", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <CheckboxField
        field={mockField}
        value={["opt1"]}
        onChange={handleChange}
      />
    );

    await user.click(screen.getByLabelText("Option 2"));

    expect(handleChange).toHaveBeenCalledWith(["opt1", "opt2"]);
  });

  it("should remove value when unchecking", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <CheckboxField
        field={mockField}
        value={["opt1", "opt2"]}
        onChange={handleChange}
      />
    );

    await user.click(screen.getByLabelText("Option 1"));

    expect(handleChange).toHaveBeenCalledWith(["opt2"]);
  });
});
```

---

###### 6.4.1.4 `RadioField.tsx` - Radio Button Group

**Test File**: `src/features/form/components/fields/RadioField.test.tsx`

```typescript
describe("RadioField", () => {
  const mockField = {
    ...mockFormField(),
    type: "radio",
    options: [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" }
    ]
  };

  it("should render all radio options", () => {
    render(
      <RadioField
        field={mockField}
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
  });

  it("should select only one option", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <RadioField
        field={mockField}
        value=""
        onChange={handleChange}
      />
    );

    await user.click(screen.getByLabelText("Option 1"));
    expect(handleChange).toHaveBeenCalledWith("opt1");

    await user.click(screen.getByLabelText("Option 2"));
    expect(handleChange).toHaveBeenCalledWith("opt2");
  });

  it("should show selected option", () => {
    render(
      <RadioField
        field={mockField}
        value="opt1"
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText("Option 1")).toBeChecked();
    expect(screen.getByLabelText("Option 2")).not.toBeChecked();
  });
});
```

---

###### 6.4.1.5 `PhoneField.tsx` - Phone Number Input

**Test File**: `src/features/form/components/fields/PhoneField.test.tsx`

```typescript
describe("PhoneField", () => {
  const mockField = {
    ...mockFormField(),
    type: "phone"
  };

  it("should render country code selector", () => {
    render(
      <PhoneField
        field={mockField}
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText("+91")).toBeInTheDocument(); // Default
  });

  it("should render phone number input", () => {
    render(
      <PhoneField
        field={mockField}
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByPlaceholderText(/phone/i)).toBeInTheDocument();
  });

  it("should parse existing phone number", () => {
    render(
      <PhoneField
        field={mockField}
        value="+919876543210"
        onChange={() => {}}
      />
    );

    expect(screen.getByText("+91")).toBeInTheDocument();
    expect(screen.getByDisplayValue("9876543210")).toBeInTheDocument();
  });

  it("should combine country code with number on change", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <PhoneField
        field={mockField}
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByPlaceholderText(/phone/i);
    await user.type(input, "9876543210");

    expect(handleChange).toHaveBeenCalledWith("+919876543210");
  });

  it("should update country code", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <PhoneField
        field={mockField}
        value="+919876543210"
        onChange={handleChange}
      />
    );

    const countrySelector = screen.getByText("+91");
    await user.click(countrySelector);
    await user.click(screen.getByText("+1")); // Select US

    expect(handleChange).toHaveBeenCalledWith("+19876543210");
  });

  it("should validate phone number length", async () => {
    const user = userEvent.setup();
    render(
      <PhoneField
        field={mockField}
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText(/phone/i);
    await user.type(input, "12345"); // Too short

    expect(screen.getByText(/invalid/i)).toBeInTheDocument();
  });
});
```

---

###### 6.4.1.6 `TextAreaField.tsx` - Multi-line Text Input

**Test File**: `src/features/form/components/fields/TextAreaField.test.tsx`

```typescript
describe("TextAreaField", () => {
  const mockField = {
    ...mockFormField(),
    type: "textarea",
    placeholder: "Enter description"
  };

  it("should render textarea", () => {
    render(
      <TextAreaField
        field={mockField}
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByPlaceholderText("Enter description")).toBeInTheDocument();
  });

  it("should handle multi-line input", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <TextAreaField
        field={mockField}
        value=""
        onChange={handleChange}
      />
    );

    const textarea = screen.getByPlaceholderText("Enter description");
    await user.type(textarea, "Line 1{Enter}Line 2");

    expect(handleChange).toHaveBeenCalled();
  });

  it("should respect max length", () => {
    const fieldWithMax = {
      ...mockField,
      property: { max_length: 100 }
    };

    render(
      <TextAreaField
        field={fieldWithMax}
        value=""
        onChange={() => {}}
      />
    );

    const textarea = screen.getByPlaceholderText("Enter description");
    expect(textarea).toHaveAttribute("maxLength", "100");
  });

  it("should show character count", () => {
    const fieldWithMax = {
      ...mockField,
      property: { max_length: 100 }
    };

    render(
      <TextAreaField
        field={fieldWithMax}
        value="Hello"
        onChange={() => {}}
      />
    );

    expect(screen.getByText("5 / 100")).toBeInTheDocument();
  });
});
```

---

##### 6.4.2 `EventForm.tsx` - Main Form Component

**Test File**: `src/features/form/components/EventForm.test.tsx`

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EventForm } from "./EventForm";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe("EventForm", () => {
  const mockEventData = {
    id: "event123",
    title: "Test Event",
    form: [
      { ...mockFormField(), id: "1", field_key: "name", page_num: 1 },
      { ...mockFormField(), id: "2", field_key: "email", type: "email", page_num: 1 }
    ]
  };

  it("should render form fields", () => {
    render(<EventForm eventData={mockEventData} />, {
      wrapper: createWrapper()
    });

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("should show validation errors on submit", async () => {
    const user = userEvent.setup();
    render(<EventForm eventData={mockEventData} />, {
      wrapper: createWrapper()
    });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it("should submit form with valid data", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <EventForm
        eventData={mockEventData}
        onSubmit={handleSubmit}
      />,
      { wrapper: createWrapper() }
    );

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com"
      });
    });
  });

  it("should navigate between pages", async () => {
    const multiPageEvent = {
      ...mockEventData,
      form: [
        { ...mockFormField(), id: "1", page_num: 1 },
        { ...mockFormField(), id: "2", page_num: 2 }
      ]
    };

    const user = userEvent.setup();
    render(<EventForm eventData={multiPageEvent} />, {
      wrapper: createWrapper()
    });

    const nextButton = screen.getByRole("button", { name: /next/i });
    await user.click(nextButton);

    expect(screen.getByText(/page 2/i)).toBeInTheDocument();
  });

  it("should hide fields based on conditions", async () => {
    const conditionalEvent = {
      ...mockEventData,
      form: [
        {
          ...mockFormField(),
          id: "1",
          field_key: "country",
          page_num: 1
        },
        {
          ...mockFormField(),
          id: "2",
          field_key: "state",
          page_num: 1,
          conditions: { field: "1", operator: "equals", value: "USA" }
        }
      ]
    };

    const user = userEvent.setup();
    render(<EventForm eventData={conditionalEvent} />, {
      wrapper: createWrapper()
    });

    // State field should be hidden initially
    expect(screen.queryByLabelText(/state/i)).not.toBeInTheDocument();

    // Select USA
    await user.type(screen.getByLabelText(/country/i), "USA");

    // State field should now appear
    await waitFor(() => {
      expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    });
  });
});
```

**New Concepts**:
- **`createWrapper()`**: Provides React Query context
- **`waitFor()`**: Wait for async changes
- **Testing providers**: Wrapping components with required contexts

---

##### 6.4.3 `fieldRegistry.ts` - Field Registry System

**Test File**: `src/features/form/components/fieldRegistry.test.ts`

```typescript
describe("fieldRegistry", () => {
  beforeEach(() => {
    fieldRegistry.clear();
  });

  it("should register field component", () => {
    const TextField = () => <input />;
    fieldRegistry.register("text", TextField);

    expect(fieldRegistry.has("text")).toBe(true);
  });

  it("should retrieve registered field component", () => {
    const TextField = () => <input />;
    fieldRegistry.register("text", TextField);

    const Component = fieldRegistry.get("text");
    expect(Component).toBe(TextField);
  });

  it("should return null for unregistered field type", () => {
    const Component = fieldRegistry.get("unknown");
    expect(Component).toBeNull();
  });

  it("should override existing field type", () => {
    const TextField1 = () => <input type="text" />;
    const TextField2 = () => <input type="email" />;

    fieldRegistry.register("text", TextField1);
    fieldRegistry.register("text", TextField2);

    expect(fieldRegistry.get("text")).toBe(TextField2);
  });
});
```

---

### 7. Components

#### 7.1 UI Components

##### 7.1.1 `Loading.tsx` - Loading Spinner

**Test File**: `src/components/ui/Loading/Loading.test.tsx`

```typescript
describe("Loading", () => {
  it("should render loading spinner", () => {
    render(<Loading />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should display custom message", () => {
    render(<Loading message="Please wait..." />);
    expect(screen.getByText("Please wait...")).toBeInTheDocument();
  });

  it("should render with custom size", () => {
    render(<Loading size="large" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("loading-large");
  });

  it("should have loading aria-label", () => {
    render(<Loading />);
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });
});
```

---

##### 7.1.2 `Error.tsx` - Error Display Component

**Test File**: `src/components/ui/Error/Error.test.tsx`

```typescript
describe("Error", () => {
  it("should display error message", () => {
    render(<Error message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("should show retry button", () => {
    const handleRetry = vi.fn();
    render(<Error message="Error" onRetry={handleRetry} />);

    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("should call onRetry when retry clicked", async () => {
    const handleRetry = vi.fn();
    const user = userEvent.setup();

    render(<Error message="Error" onRetry={handleRetry} />);

    await user.click(screen.getByRole("button", { name: /retry/i }));
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("should display error icon", () => {
    render(<Error message="Error" />);
    expect(screen.getByRole("img", { name: /error/i })).toBeInTheDocument();
  });

  it("should have error role for accessibility", () => {
    render(<Error message="Error" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
```

---

##### 7.1.3 `DateComponent.tsx` - Date Display

**Test File**: `src/components/ui/DateComponent/DateComponent.test.tsx`

```typescript
describe("DateComponent", () => {
  it("should format date correctly", () => {
    const date = new Date("2024-03-15T10:00:00Z");
    render(<DateComponent date={date} />);

    expect(screen.getByText("March 15, 2024")).toBeInTheDocument();
  });

  it("should handle custom format", () => {
    const date = new Date("2024-03-15T10:00:00Z");
    render(<DateComponent date={date} format="short" />);

    expect(screen.getByText("3/15/2024")).toBeInTheDocument();
  });

  it("should display time when includeTime is true", () => {
    const date = new Date("2024-03-15T10:30:00Z");
    render(<DateComponent date={date} includeTime />);

    expect(screen.getByText(/10:30/)).toBeInTheDocument();
  });

  it("should handle invalid date", () => {
    render(<DateComponent date={new Date("invalid")} />);
    expect(screen.getByText("Invalid Date")).toBeInTheDocument();
  });
});
```

---

##### 7.1.4 `LocationComponent.tsx` - Location Display

**Test File**: `src/components/ui/LocationComponent/LocationComponent.test.tsx`

```typescript
describe("LocationComponent", () => {
  it("should display location name", () => {
    render(<LocationComponent location="New York, NY" />);
    expect(screen.getByText("New York, NY")).toBeInTheDocument();
  });

  it("should show map link", () => {
    render(<LocationComponent location="New York, NY" showMap />);

    const link = screen.getByRole("link", { name: /view map/i });
    expect(link).toHaveAttribute("href", expect.stringContaining("maps"));
  });

  it("should display location icon", () => {
    render(<LocationComponent location="New York, NY" />);
    expect(screen.getByRole("img", { name: /location/i })).toBeInTheDocument();
  });

  it("should handle empty location", () => {
    render(<LocationComponent location="" />);
    expect(screen.getByText("Location not specified")).toBeInTheDocument();
  });
});
```

---

#### 7.2 Layout Components

##### 7.2.1 `Footer.tsx` - Page Footer

**Test File**: `src/components/layouts/Footer/Footer.test.tsx`

```typescript
describe("Footer", () => {
  it("should render footer content", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("should display copyright text", () => {
    render(<Footer />);
    expect(screen.getByText(/copyright/i)).toBeInTheDocument();
  });

  it("should show social media links", () => {
    render(<Footer />);

    expect(screen.getByLabelText("Facebook")).toBeInTheDocument();
    expect(screen.getByLabelText("Twitter")).toBeInTheDocument();
  });

  it("should have correct link hrefs", () => {
    render(<Footer />);

    const fbLink = screen.getByLabelText("Facebook");
    expect(fbLink).toHaveAttribute("href", expect.stringContaining("facebook.com"));
  });

  it("should open external links in new tab", () => {
    render(<Footer />);

    const links = screen.getAllByRole("link");
    links.forEach(link => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
```

---

#### 7.3 SEO Components

##### 7.3.1 `SEO.tsx` - SEO Meta Tags

**Test File**: `src/components/seo/SEO/SEO.test.tsx`

```typescript
import { Helmet } from "react-helmet";
import { describe, expect, it } from "vitest";
import { SEO } from "./SEO";

describe("SEO", () => {
  it("should set page title", () => {
    render(<SEO title="Test Page" />);

    const helmet = Helmet.peek();
    expect(helmet.title).toBe("Test Page");
  });

  it("should set meta description", () => {
    render(<SEO description="Test description" />);

    const helmet = Helmet.peek();
    const descMeta = helmet.metaTags.find(tag => tag.name === "description");
    expect(descMeta.content).toBe("Test description");
  });

  it("should set Open Graph tags", () => {
    render(<SEO title="Test" description="Desc" image="/image.jpg" />);

    const helmet = Helmet.peek();
    const ogTags = helmet.metaTags.filter(tag =>
      tag.property?.startsWith("og:")
    );

    expect(ogTags.length).toBeGreaterThan(0);
  });

  it("should set Twitter Card tags", () => {
    render(<SEO title="Test" description="Desc" />);

    const helmet = Helmet.peek();
    const twitterTags = helmet.metaTags.filter(tag =>
      tag.name?.startsWith("twitter:")
    );

    expect(twitterTags.length).toBeGreaterThan(0);
  });

  it("should handle default values", () => {
    render(<SEO />);

    const helmet = Helmet.peek();
    expect(helmet.title).toBeDefined();
  });
});
```

---

### 8. Features / Event

#### 8.1 `EventPage.tsx` - Event Information Page

**Test File**: `src/features/event/EventPage.test.tsx`

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EventPage } from "./EventPage";
import * as eventInfoApi from "./api/eventInfoApi";

vi.mock("./api/eventInfoApi");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe("EventPage", () => {
  const mockEventData = {
    id: "event123",
    title: "Test Event",
    description: "Event description",
    date: "2024-03-15",
    location: "New York"
  };

  it("should show loading state", () => {
    vi.mocked(eventInfoApi.fetchEventInfo).mockReturnValue(
      new Promise(() => {}) // Never resolves
    );

    render(<EventPage eventId="event123" />, {
      wrapper: createWrapper()
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should display event information", async () => {
    vi.mocked(eventInfoApi.fetchEventInfo).mockResolvedValue(mockEventData);

    render(<EventPage eventId="event123" />, {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(screen.getByText("Test Event")).toBeInTheDocument();
      expect(screen.getByText("Event description")).toBeInTheDocument();
    });
  });

  it("should show error on fetch failure", async () => {
    vi.mocked(eventInfoApi.fetchEventInfo).mockRejectedValue(
      new Error("Failed to fetch")
    );

    render(<EventPage eventId="event123" />, {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it("should display register button", async () => {
    vi.mocked(eventInfoApi.fetchEventInfo).mockResolvedValue(mockEventData);

    render(<EventPage eventId="event123" />, {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
    });
  });
});
```

---

#### 8.2 `eventInfoApi.ts` - Event API

**Test File**: `src/features/event/api/eventInfoApi.test.ts`

```typescript
import { apiClient } from "@/lib/axios/client";
import { describe, expect, it, vi } from "vitest";
import { fetchEventInfo } from "./eventInfoApi";

vi.mock("@/lib/axios/client");

describe("eventInfoApi", () => {
  it("should fetch event information", async () => {
    const mockEvent = { id: "event123", title: "Test Event" };
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockEvent });

    const result = await fetchEventInfo("event123");

    expect(apiClient.get).toHaveBeenCalledWith("/events/event123");
    expect(result).toEqual(mockEvent);
  });

  it("should handle API errors", async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error("Not found"));

    await expect(fetchEventInfo("invalid")).rejects.toThrow("Not found");
  });
});
```

---

### 9. Lib / Axios

#### 9.1 `client.ts` - Axios Client Configuration

**Test File**: `src/lib/axios/client.test.ts`

```typescript
import axios from "axios";
import { describe, expect, it, vi } from "vitest";
import { apiClient } from "./client";

describe("apiClient", () => {
  it("should have base URL configured", () => {
    expect(apiClient.defaults.baseURL).toBeDefined();
  });

  it("should set default headers", () => {
    expect(apiClient.defaults.headers.common["Content-Type"]).toBe(
      "application/json"
    );
  });

  it("should handle request interceptors", async () => {
    // Test that interceptors add auth tokens, etc.
    const mockRequest = { headers: {} };
    const interceptor = apiClient.interceptors.request.handlers[0];

    if (interceptor) {
      const result = interceptor.fulfilled(mockRequest);
      expect(result.headers).toBeDefined();
    }
  });

  it("should handle response interceptors", async () => {
    // Test error handling, token refresh, etc.
    const mockError = { response: { status: 401 } };
    const interceptor = apiClient.interceptors.response.handlers[0];

    if (interceptor?.rejected) {
      await expect(interceptor.rejected(mockError)).rejects.toBeDefined();
    }
  });
});
```

---

### 10. Config

#### 10.1 `env.ts` - Environment Variables

**Test File**: `src/config/env.test.ts`

```typescript
describe("env", () => {
  it("should export API URL", () => {
    expect(env.API_URL).toBeDefined();
    expect(typeof env.API_URL).toBe("string");
  });

  it("should export environment name", () => {
    expect(env.NODE_ENV).toBeDefined();
    expect(["development", "production", "test"]).toContain(env.NODE_ENV);
  });

  it("should validate required env vars", () => {
    expect(() => validateEnv()).not.toThrow();
  });

  it("should throw on missing required vars", () => {
    const originalEnv = process.env.API_URL;
    delete process.env.API_URL;

    expect(() => validateEnv()).toThrow();

    process.env.API_URL = originalEnv; // Restore
  });
});
```

---

#### 10.2 `constants.ts` - Application Constants

**Test File**: `src/config/constants.test.ts`

```typescript
describe("constants", () => {
  it("should export form constants", () => {
    expect(FORM_CONSTANTS.MAX_FILE_SIZE).toBeDefined();
    expect(typeof FORM_CONSTANTS.MAX_FILE_SIZE).toBe("number");
  });

  it("should export validation messages", () => {
    expect(VALIDATION_MESSAGES.REQUIRED).toBe("This field is required");
    expect(VALIDATION_MESSAGES.EMAIL).toBeDefined();
  });

  it("should export API endpoints", () => {
    expect(API_ENDPOINTS.SUBMIT_FORM).toBe("/submit");
    expect(API_ENDPOINTS.EVENT_INFO).toBeDefined();
  });
});
```

---

## Test Patterns & Best Practices

### 1. Test Organization

```typescript
describe("ComponentName", () => {
  // Setup
  beforeEach(() => {
    // Reset state, clear mocks
  });

  // Group related tests
  describe("feature/method name", () => {
    it("should describe expected behavior", () => {
      // Arrange - Set up test data
      // Act - Execute code
      // Assert - Verify results
    });
  });
});
```

### 2. Mock Data Factories

Create reusable mock data generators:

```typescript
// test/factories.ts
export const mockFormField = (overrides = {}): FormField => ({
  id: "1",
  type: "text",
  title: "Field",
  required: false,
  field_key: "field",
  hidden: false,
  unique: null,
  options: [],
  page_num: 1,
  property: {},
  conditions: {},
  team_field: false,
  description: null,
  placeholder: null,
  ...overrides
});

export const mockEventData = (overrides = {}) => ({
  id: "event123",
  title: "Test Event",
  form: [],
  ...overrides
});
```

### 3. Custom Test Utilities

```typescript
// test/utils.tsx
export const renderWithProviders = (
  ui: React.ReactElement,
  options = {}
) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>,
    options
  );
};
```

### 4. Test Coverage Commands

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run with UI
npm run test:ui
```

### 5. Coverage Exclusions

Update `vitest.config.ts` to exclude files from coverage:

```typescript
coverage: {
  exclude: [
    "node_modules/",
    "src/test/",
    "**/*.d.ts",
    "**/*.config.*",
    "**/mockData",
    "dist/",
    "**/*.test.{ts,tsx}",  // Exclude test files
    "**/index.ts",          // Exclude barrel exports (optional)
  ]
}
```

---

## Coverage Metrics

### Current Coverage Breakdown

| Module | Lines | Functions | Branches | Statements | Priority |
|--------|-------|-----------|----------|------------|----------|
| Features | 0% | 0% | 0% | 0% | HIGH |
| Components (non-Button) | 0% | 0% | 0% | 0% | HIGH |
| Core/Validators | 39% | 100% | 100% | 39% | MEDIUM |
| Core/Business Rules | 21% | 83% | 75% | 21% | MEDIUM |
| Core/Transformers | 0% | 100% | 100% | 0% | MEDIUM |
| Core/Operators | 88% | 100% | 83% | 88% | LOW |
| Utils | 62% | 83% | 33% | 62% | MEDIUM |
| Lib/Axios | 0% | 0% | 0% | 0% | MEDIUM |

### Test Implementation Order

**Phase 1** (0% → 40%):
1. Core validators (remaining files)
2. Core transformers
3. Core business rules
4. Utils (complete phoneUtils)

**Phase 2** (40% → 70%):
5. Form hooks
6. Form utils
7. API clients
8. Field components

**Phase 3** (70% → 85%):
9. Page components (EventForm, FormPage)
10. UI components (Loading, Error, etc.)
11. Layout components
12. Integration tests

---

## Summary

To achieve **85% test coverage**:

1. **Write ~150-200 test files** covering all modules
2. **Focus on business logic first** (core, utils, hooks)
3. **Test components next** (fields, forms, pages)
4. **Add integration tests** for critical user flows
5. **Use test patterns** consistently across codebase
6. **Run coverage regularly** to track progress

**Estimated Test Cases**: 800-1000 individual test cases
**Estimated Time**: 40-60 hours of focused testing work

**Key Success Factors**:
- Comprehensive mock data factories
- Reusable test utilities
- Clear test organization
- Regular coverage monitoring
- Focus on edge cases and error handling

---

**Document Version**: 1.0
**Last Updated**: 2025-10-14
**Target Coverage**: 85%
**Current Coverage**: 6.18%
