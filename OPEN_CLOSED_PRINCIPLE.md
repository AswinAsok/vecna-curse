# Open/Closed Principle Implementation Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Understanding the Open/Closed Principle](#understanding-the-openclosed-principle)
3. [Current Violations in the Project](#current-violations-in-the-project)
4. [Refactoring Strategies](#refactoring-strategies)
5. [Implementation Examples](#implementation-examples)
6. [Best Practices](#best-practices)
7. [Benefits](#benefits)

---

## Introduction

The Open/Closed Principle (OCP) is one of the five SOLID principles of object-oriented design. It states:

> **Software entities (classes, modules, functions, etc.) should be open for extension but closed for modification.**

This means you should be able to add new functionality without changing existing code. This document provides practical guidance for implementing OCP throughout the **vecnas-curse** project.

---

## Understanding the Open/Closed Principle

### Core Concepts

**Open for Extension**: You can add new behaviors or capabilities to the system.

**Closed for Modification**: Existing code should not need to be changed when adding new features.

### Why It Matters

- **Reduces bugs**: Existing, tested code remains untouched
- **Improves maintainability**: New features don't require hunting through existing code
- **Enables scalability**: Easy to add new functionality as requirements grow
- **Supports testing**: Existing tests remain valid

### Common Violations

1. **Switch/if-else chains** that require modification when adding new cases
2. **Hardcoded values** that need to be changed for new scenarios
3. **Monolithic functions** that handle multiple responsibilities

---

## Current Violations in the Project

### 1. Form Field Renderer (HIGH PRIORITY)

**Location**: `src/components/FormPage/components/FormFieldsRenderer.tsx:18-85`

**Problem**:
The `FormFieldsRenderer` uses a large switch statement. Every time a new field type is added, this component must be modified.

```typescript
switch (field.type) {
    case "text":
    case "email":
    case "number":
        return <TextField ... />;
    case "phone":
        return <PhoneField ... />;
    // ... more cases
}
```

**Impact**:
- Adding a date picker, file upload, or rich text editor requires modifying this file
- Risk of breaking existing functionality
- Violates Single Responsibility Principle as well

---

### 2. Field Condition Operators (MEDIUM PRIORITY)

**Location**: `src/utils/fieldConditions.ts:38-45`

**Problem**:
The condition checker only supports `=` and `!=` operators. Adding new operators (like `>`, `<`, `contains`, `startsWith`) requires modifying this function.

```typescript
switch (operator) {
    case "=":
        return currentValue === conditionValue;
    case "!=":
        return currentValue !== conditionValue;
    default:
        return true;
}
```

**Impact**:
- Limited conditional logic
- Every new operator requires code modification
- No way to add custom business-specific operators

---

### 3. Validators (MEDIUM PRIORITY)

**Location**: `src/utils/validators.ts:21-44`

**Problem**:
The `validateField` function hardcodes validation logic. Adding new validation types (phone format, URL format, custom regex, etc.) requires modifying this function.

```typescript
export const validateField = (field: FormField, value: string | undefined) => {
    if (field.required && !isRequiredFieldValid(value)) {
        // ...
    }
    if (field.type === "email" && value && value.trim() !== "") {
        // ...
    }
    // Need to modify this function for each new validation type
    return { isValid: true };
};
```

**Impact**:
- Cannot add custom validators without touching core code
- Validation logic is tightly coupled to field types
- Difficult to add business-specific validation rules

---

### 4. Form Data Transformers (LOW-MEDIUM PRIORITY)

**Location**: `src/utils/formDataTransformers.ts:6-26`

**Problem**:
Instagram field transformation is hardcoded with specific field keys. Adding Twitter, LinkedIn, or other social media transformations requires modifying or duplicating code.

```typescript
export const transformInstagramFields = (formData: Record<string, string>) => {
    const instagramFieldKeys = ["__vecna_sees_your_instagram_id", "partner_instagram_id"];
    // Hardcoded logic
};
```

**Impact**:
- Each new social media platform requires a new function or modification
- Duplication of transformation logic
- No unified approach to field transformations

---

### 5. Business Rules (LOW PRIORITY)

**Location**: `src/utils/businessRules.ts:8-21`

**Problem**:
Email validation rule is hardcoded for Indian phone codes. Adding new country-specific rules requires code modification.

```typescript
export const shouldValidateEmailField = (
    allFormFields: FormField[],
    formData: Record<string, string>
): boolean => {
    // Hardcoded +91 check
    const hasNonIndianPhone = phoneFields.some((phoneField) => {
        const code = extractCountryCode(formData[phoneField.field_key]);
        return code !== "+91";
    });
    return hasNonIndianPhone;
};
```

**Impact**:
- Cannot add region-specific rules without code changes
- Business logic is tightly coupled to implementation
- Difficult to configure rules without developer intervention

---

## Refactoring Strategies

### Strategy 1: Registry Pattern

**Use Case**: Form field rendering, validators, transformers

**How it works**:
- Create a registry/map of handlers
- Register handlers without modifying core code
- Look up handlers dynamically

### Strategy 2: Strategy Pattern

**Use Case**: Field conditions, business rules

**How it works**:
- Define an interface for strategies
- Implement different strategies as separate classes/functions
- Select and execute strategies at runtime

### Strategy 3: Chain of Responsibility

**Use Case**: Validators, transformers

**How it works**:
- Create a chain of handlers
- Each handler can process or pass to the next
- Add new handlers without modifying existing ones

### Strategy 4: Configuration-Driven Design

**Use Case**: Business rules, field mappings

**How it works**:
- Move hardcoded values to configuration
- Use configuration to drive behavior
- Change behavior by updating configuration, not code

---

## Implementation Examples

### Example 1: Refactoring Form Field Renderer

#### Before (Violates OCP)

```typescript
// FormFieldsRenderer.tsx
const FormFieldsRenderer = ({ field, value, handleInputChange }) => {
    switch (field.type) {
        case "text":
            return <TextField ... />;
        case "phone":
            return <PhoneField ... />;
        // More cases...
    }
};
```

#### After (Follows OCP)

**Step 1**: Create a field registry

```typescript
// src/components/FormPage/registry/fieldRegistry.ts
import type { FormField } from "../../../services/types";
import type { ComponentType } from "react";

export interface FieldComponentProps {
    field: FormField;
    value: string;
    handleInputChange: (key: string, value: string) => void;
}

type FieldComponent = ComponentType<FieldComponentProps>;

class FieldRegistry {
    private registry: Map<string, FieldComponent> = new Map();

    /**
     * Register a field component for a specific field type
     */
    register(type: string, component: FieldComponent): void {
        this.registry.set(type, component);
    }

    /**
     * Register multiple field types to use the same component
     */
    registerMultiple(types: string[], component: FieldComponent): void {
        types.forEach(type => this.register(type, component));
    }

    /**
     * Get the component for a field type
     */
    get(type: string): FieldComponent | undefined {
        return this.registry.get(type);
    }

    /**
     * Check if a field type is registered
     */
    has(type: string): boolean {
        return this.registry.has(type);
    }
}

export const fieldRegistry = new FieldRegistry();
```

**Step 2**: Register field components

```typescript
// src/components/FormPage/registry/registerDefaultFields.ts
import { fieldRegistry } from "./fieldRegistry";
import TextField from "../components/TextField";
import PhoneField from "../components/PhoneField";
import RadioField from "../components/RadioField";
import CheckboxField from "../components/CheckboxField";
import TextAreaField from "../components/TextAreaField";
import SelectField from "../components/SelectField";

/**
 * Register all default field types
 * This runs once at application startup
 */
export const registerDefaultFields = () => {
    // Text-based fields
    fieldRegistry.registerMultiple(
        ["text", "email", "number", "url"],
        TextField
    );

    // Phone field
    fieldRegistry.register("phone", PhoneField);

    // Choice fields
    fieldRegistry.register("radio", RadioField);
    fieldRegistry.register("checkbox", CheckboxField);

    // Long-form text
    fieldRegistry.register("textarea", TextAreaField);

    // Dropdown fields
    fieldRegistry.registerMultiple(
        ["select", "dropdown"],
        SelectField
    );
};
```

**Step 3**: Refactor the renderer

```typescript
// src/components/FormPage/components/FormFieldsRenderer.tsx
import type { FormField } from "../../../services/types";
import { fieldRegistry } from "../registry/fieldRegistry";

const FormFieldsRenderer = ({
    field,
    value,
    handleInputChange,
}: {
    field: FormField;
    value: string;
    handleInputChange: (key: string, value: string) => void;
}) => {
    const FieldComponent = fieldRegistry.get(field.type);

    if (!FieldComponent) {
        console.warn(`No component registered for field type: ${field.type}`);
        return null;
    }

    return (
        <FieldComponent
            key={field.id}
            field={field}
            value={value}
            handleInputChange={handleInputChange}
        />
    );
};

export default FormFieldsRenderer;
```

**Step 4**: Initialize in your app

```typescript
// src/main.tsx
import { registerDefaultFields } from "./components/FormPage/registry/registerDefaultFields";

// Register field components before rendering
registerDefaultFields();

// ... rest of your app initialization
```

**Benefits**:
- ✅ Adding a new field type (e.g., date picker) requires NO modification to FormFieldsRenderer
- ✅ New field types are registered in one place
- ✅ Third-party plugins could register their own field types
- ✅ Easy to test individual components in isolation

**Adding a new field type** (e.g., DatePicker):

```typescript
// src/components/FormPage/components/DatePickerField.tsx
import type { FieldComponentProps } from "../registry/fieldRegistry";

const DatePickerField = ({ field, value, handleInputChange }: FieldComponentProps) => {
    return (
        <div>
            <label>{field.title}</label>
            <input
                type="date"
                value={value || ""}
                onChange={(e) => handleInputChange(field.field_key, e.target.value)}
            />
        </div>
    );
};

export default DatePickerField;

// Register it (in registerDefaultFields.ts or a plugin file)
import DatePickerField from "../components/DatePickerField";
fieldRegistry.register("date", DatePickerField);
```

---

### Example 2: Refactoring Field Condition Operators

#### Before (Violates OCP)

```typescript
// fieldConditions.ts
switch (operator) {
    case "=":
        return currentValue === conditionValue;
    case "!=":
        return currentValue !== conditionValue;
    default:
        return true;
}
```

#### After (Follows OCP)

**Step 1**: Define operator interface and registry

```typescript
// src/utils/conditions/operatorRegistry.ts
export type OperatorFunction = (currentValue: string, conditionValue: string) => boolean;

class OperatorRegistry {
    private operators: Map<string, OperatorFunction> = new Map();

    /**
     * Register a condition operator
     */
    register(operator: string, fn: OperatorFunction): void {
        this.operators.set(operator, fn);
    }

    /**
     * Evaluate a condition using a registered operator
     */
    evaluate(operator: string, currentValue: string, conditionValue: string): boolean {
        const fn = this.operators.get(operator);

        if (!fn) {
            console.warn(`Unknown operator: ${operator}, defaulting to true`);
            return true;
        }

        return fn(currentValue, conditionValue);
    }

    /**
     * Check if an operator is registered
     */
    has(operator: string): boolean {
        return this.operators.has(operator);
    }
}

export const operatorRegistry = new OperatorRegistry();
```

**Step 2**: Register default operators

```typescript
// src/utils/conditions/registerDefaultOperators.ts
import { operatorRegistry } from "./operatorRegistry";

export const registerDefaultOperators = () => {
    // Equality
    operatorRegistry.register("=", (current, condition) => current === condition);

    // Inequality
    operatorRegistry.register("!=", (current, condition) => current !== condition);

    // Comparison (useful for numbers)
    operatorRegistry.register(">", (current, condition) => {
        return parseFloat(current) > parseFloat(condition);
    });

    operatorRegistry.register("<", (current, condition) => {
        return parseFloat(current) < parseFloat(condition);
    });

    operatorRegistry.register(">=", (current, condition) => {
        return parseFloat(current) >= parseFloat(condition);
    });

    operatorRegistry.register("<=", (current, condition) => {
        return parseFloat(current) <= parseFloat(condition);
    });

    // String operations
    operatorRegistry.register("contains", (current, condition) => {
        return current.toLowerCase().includes(condition.toLowerCase());
    });

    operatorRegistry.register("startsWith", (current, condition) => {
        return current.toLowerCase().startsWith(condition.toLowerCase());
    });

    operatorRegistry.register("endsWith", (current, condition) => {
        return current.toLowerCase().endsWith(condition.toLowerCase());
    });

    // Regex match
    operatorRegistry.register("matches", (current, condition) => {
        try {
            const regex = new RegExp(condition);
            return regex.test(current);
        } catch (e) {
            console.error("Invalid regex pattern:", condition);
            return false;
        }
    });
};
```

**Step 3**: Use in field conditions

```typescript
// src/utils/fieldConditions.ts
import type { EventData, FormField } from "../services/types";
import { operatorRegistry } from "./conditions/operatorRegistry";

export const checkFieldConditions = (
    field: FormField,
    formData: Record<string, string>,
    allFormFields: FormField[]
): boolean => {
    if (!field.conditions || Object.keys(field.conditions).length === 0) {
        return true;
    }

    const {
        field: fieldId,
        value: conditionValue,
        operator,
    } = field.conditions as {
        field?: string;
        value?: string;
        operator?: string;
    };

    if (!fieldId || !conditionValue || !operator) {
        return true;
    }

    const referencedField = allFormFields.find((f) => f.id === fieldId);
    if (!referencedField) {
        return true;
    }

    const currentValue = formData[referencedField.field_key] || "";

    // Use the operator registry instead of switch statement
    return operatorRegistry.evaluate(operator, currentValue, conditionValue);
};
```

**Step 4**: Initialize operators

```typescript
// src/main.tsx
import { registerDefaultOperators } from "./utils/conditions/registerDefaultOperators";

registerDefaultOperators();
```

**Benefits**:
- ✅ Adding new operators requires NO modification to checkFieldConditions
- ✅ Operators are defined in one centralized location
- ✅ Easy to add domain-specific operators
- ✅ Each operator is independently testable

**Adding a custom operator**:

```typescript
// Add a custom "isEmpty" operator
operatorRegistry.register("isEmpty", (current, condition) => {
    const isEmpty = !current || current.trim() === "";
    return condition === "true" ? isEmpty : !isEmpty;
});

// Now you can use it in conditions without changing any code:
// { operator: "isEmpty", value: "true" }
```

---

### Example 3: Refactoring Validators

#### Before (Violates OCP)

```typescript
// validators.ts
export const validateField = (field: FormField, value: string | undefined) => {
    if (field.required && !isRequiredFieldValid(value)) {
        return { isValid: false, error: "This field is required" };
    }

    if (field.type === "email" && value && value.trim() !== "") {
        if (!isValidEmail(value)) {
            return { isValid: false, error: "Please enter a valid email address" };
        }
    }

    return { isValid: true };
};
```

#### After (Follows OCP)

**Step 1**: Define validator interface

```typescript
// src/utils/validation/validatorRegistry.ts
import type { FormField } from "../../services/types";

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export type ValidatorFunction = (
    field: FormField,
    value: string | undefined
) => ValidationResult;

class ValidatorRegistry {
    private validators: ValidatorFunction[] = [];

    /**
     * Register a validator function
     * Validators are checked in the order they are registered
     */
    register(validator: ValidatorFunction): void {
        this.validators.push(validator);
    }

    /**
     * Validate a field using all registered validators
     * Returns the first validation error encountered
     */
    validate(field: FormField, value: string | undefined): ValidationResult {
        for (const validator of this.validators) {
            const result = validator(field, value);
            if (!result.isValid) {
                return result;
            }
        }
        return { isValid: true };
    }

    /**
     * Clear all validators (useful for testing)
     */
    clear(): void {
        this.validators = [];
    }
}

export const validatorRegistry = new ValidatorRegistry();
```

**Step 2**: Create individual validators

```typescript
// src/utils/validation/validators/requiredValidator.ts
import type { ValidatorFunction } from "../validatorRegistry";

export const requiredValidator: ValidatorFunction = (field, value) => {
    if (!field.required) {
        return { isValid: true };
    }

    const isValid = Boolean(value && value.trim() !== "");

    return isValid
        ? { isValid: true }
        : { isValid: false, error: "This field is required" };
};
```

```typescript
// src/utils/validation/validators/emailValidator.ts
import type { ValidatorFunction } from "../validatorRegistry";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailValidator: ValidatorFunction = (field, value) => {
    // Only validate email fields with values
    if (field.type !== "email" || !value || value.trim() === "") {
        return { isValid: true };
    }

    const isValid = EMAIL_REGEX.test(value.trim());

    return isValid
        ? { isValid: true }
        : { isValid: false, error: "Please enter a valid email address" };
};
```

```typescript
// src/utils/validation/validators/phoneValidator.ts
import type { ValidatorFunction } from "../validatorRegistry";

export const phoneValidator: ValidatorFunction = (field, value) => {
    if (field.type !== "phone" || !value || value.trim() === "") {
        return { isValid: true };
    }

    // Basic phone validation - adjust as needed
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanedValue = value.replace(/[\s()-]/g, "");

    const isValid = phoneRegex.test(cleanedValue);

    return isValid
        ? { isValid: true }
        : { isValid: false, error: "Please enter a valid phone number" };
};
```

```typescript
// src/utils/validation/validators/urlValidator.ts
import type { ValidatorFunction } from "../validatorRegistry";

export const urlValidator: ValidatorFunction = (field, value) => {
    if (field.type !== "url" || !value || value.trim() === "") {
        return { isValid: true };
    }

    try {
        new URL(value);
        return { isValid: true };
    } catch {
        return { isValid: false, error: "Please enter a valid URL" };
    }
};
```

```typescript
// src/utils/validation/validators/numberValidator.ts
import type { ValidatorFunction } from "../validatorRegistry";

export const numberValidator: ValidatorFunction = (field, value) => {
    if (field.type !== "number" || !value || value.trim() === "") {
        return { isValid: true };
    }

    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
        return { isValid: false, error: "Please enter a valid number" };
    }

    return { isValid: true };
};
```

**Step 3**: Register validators

```typescript
// src/utils/validation/registerDefaultValidators.ts
import { validatorRegistry } from "./validatorRegistry";
import { requiredValidator } from "./validators/requiredValidator";
import { emailValidator } from "./validators/emailValidator";
import { phoneValidator } from "./validators/phoneValidator";
import { urlValidator } from "./validators/urlValidator";
import { numberValidator } from "./validators/numberValidator";

export const registerDefaultValidators = () => {
    // Order matters! Required should be checked first
    validatorRegistry.register(requiredValidator);
    validatorRegistry.register(emailValidator);
    validatorRegistry.register(phoneValidator);
    validatorRegistry.register(urlValidator);
    validatorRegistry.register(numberValidator);
};
```

**Step 4**: Update validators.ts

```typescript
// src/utils/validators.ts
import type { FormField } from "../services/types";
import { validatorRegistry } from "./validation/validatorRegistry";

/**
 * Validates a single field based on its type and requirements
 */
export const validateField = (
    field: FormField,
    value: string | undefined
) => {
    return validatorRegistry.validate(field, value);
};

// Keep these helper functions for backward compatibility if needed
export const isRequiredFieldValid = (value: string | undefined): boolean => {
    return Boolean(value && value.trim() !== "");
};

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};
```

**Step 5**: Initialize validators

```typescript
// src/main.tsx
import { registerDefaultValidators } from "./utils/validation/registerDefaultValidators";

registerDefaultValidators();
```

**Benefits**:
- ✅ Adding new validators requires NO modification to validateField
- ✅ Each validator is focused and independently testable
- ✅ Easy to add custom business-specific validators
- ✅ Validators can be reordered or conditionally registered

**Adding a custom validator**:

```typescript
// src/utils/validation/validators/minLengthValidator.ts
import type { ValidatorFunction } from "../validatorRegistry";

export const minLengthValidator: ValidatorFunction = (field, value) => {
    const minLength = (field.property as any)?.minLength;

    if (!minLength || !value) {
        return { isValid: true };
    }

    const isValid = value.length >= minLength;

    return isValid
        ? { isValid: true }
        : { isValid: false, error: `Minimum length is ${minLength} characters` };
};

// Register it
validatorRegistry.register(minLengthValidator);
```

---

### Example 4: Refactoring Form Data Transformers

#### Before (Violates OCP)

```typescript
// formDataTransformers.ts
export const transformInstagramFields = (formData: Record<string, string>) => {
    const instagramFieldKeys = ["__vecna_sees_your_instagram_id", "partner_instagram_id"];
    // Transform logic...
};
```

#### After (Follows OCP)

**Step 1**: Create transformer registry

```typescript
// src/utils/transformers/transformerRegistry.ts
export type TransformerFunction = (
    formData: Record<string, string>
) => Record<string, string>;

class TransformerRegistry {
    private transformers: TransformerFunction[] = [];

    /**
     * Register a transformer function
     */
    register(transformer: TransformerFunction): void {
        this.transformers.push(transformer);
    }

    /**
     * Apply all registered transformers to form data
     */
    transform(formData: Record<string, string>): Record<string, string> {
        return this.transformers.reduce(
            (data, transformer) => transformer(data),
            formData
        );
    }

    /**
     * Clear all transformers
     */
    clear(): void {
        this.transformers = [];
    }
}

export const transformerRegistry = new TransformerRegistry();
```

**Step 2**: Create specific transformers

```typescript
// src/utils/transformers/trimTransformer.ts
import type { TransformerFunction } from "./transformerRegistry";

export const trimTransformer: TransformerFunction = (formData) => {
    const trimmedData: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "string") {
            trimmedData[key] = value.trim();
        } else {
            trimmedData[key] = value;
        }
    });

    return trimmedData;
};
```

```typescript
// src/utils/transformers/socialMediaTransformers.ts
import type { TransformerFunction } from "./transformerRegistry";

/**
 * Generic social media profile link transformer
 */
const createSocialMediaTransformer = (
    fieldKeys: string[],
    baseUrl: string,
    cleanupPattern?: RegExp
): TransformerFunction => {
    return (formData) => {
        const transformedData = { ...formData };

        fieldKeys.forEach((fieldKey) => {
            const value = transformedData[fieldKey];

            if (!value || value.trim() === "") {
                return;
            }

            let cleanId = value.trim();

            // Remove @ symbol if present
            cleanId = cleanId.replace(/^@/, "");

            // Remove existing profile URLs if present
            if (cleanupPattern) {
                cleanId = cleanId.replace(cleanupPattern, "");
            }

            // Only transform if it's not already a full URL
            if (!cleanId.startsWith("http")) {
                transformedData[fieldKey] = `${baseUrl}${cleanId}`;
            }
        });

        return transformedData;
    };
};

/**
 * Instagram transformer
 */
export const instagramTransformer = createSocialMediaTransformer(
    ["__vecna_sees_your_instagram_id", "partner_instagram_id"],
    "https://www.instagram.com/",
    /^https?:\/\/(www\.)?instagram\.com\//i
);

/**
 * Twitter/X transformer
 */
export const twitterTransformer = createSocialMediaTransformer(
    ["twitter_handle", "partner_twitter"],
    "https://twitter.com/",
    /^https?:\/\/(www\.)?(twitter|x)\.com\//i
);

/**
 * LinkedIn transformer
 */
export const linkedinTransformer = createSocialMediaTransformer(
    ["linkedin_profile", "partner_linkedin"],
    "https://www.linkedin.com/in/",
    /^https?:\/\/(www\.)?linkedin\.com\/in\//i
);
```

**Step 3**: Register transformers

```typescript
// src/utils/transformers/registerDefaultTransformers.ts
import { transformerRegistry } from "./transformerRegistry";
import { trimTransformer } from "./trimTransformer";
import {
    instagramTransformer,
    twitterTransformer,
    linkedinTransformer
} from "./socialMediaTransformers";

export const registerDefaultTransformers = () => {
    // Register in order of execution
    transformerRegistry.register(trimTransformer);
    transformerRegistry.register(instagramTransformer);
    transformerRegistry.register(twitterTransformer);
    transformerRegistry.register(linkedinTransformer);
};
```

**Step 4**: Update formDataTransformers.ts

```typescript
// src/utils/formDataTransformers.ts
import { transformerRegistry } from "./transformers/transformerRegistry";

/**
 * Apply all registered transformers to form data
 */
export const transformFormData = (
    formData: Record<string, string>
): Record<string, string> => {
    return transformerRegistry.transform(formData);
};

// Keep legacy functions for backward compatibility if needed
export const transformInstagramFields = (formData: Record<string, string>) => {
    // Implementation...
};

export const trimFormData = (formData: Record<string, string>) => {
    // Implementation...
};
```

**Step 5**: Initialize transformers

```typescript
// src/main.tsx
import { registerDefaultTransformers } from "./utils/transformers/registerDefaultTransformers";

registerDefaultTransformers();
```

**Step 6**: Use in your form submission

```typescript
// Before
const preparedData = trimFormData(transformInstagramFields(formData));

// After
import { transformFormData } from "../utils/formDataTransformers";
const preparedData = transformFormData(formData);
```

**Benefits**:
- ✅ Adding new social media platforms requires NO modification to core code
- ✅ Transformers are composable and reusable
- ✅ Easy to enable/disable transformers
- ✅ Order of transformations is explicit and configurable

**Adding a new transformer**:

```typescript
// src/utils/transformers/phoneNumberTransformer.ts
import type { TransformerFunction } from "./transformerRegistry";

export const phoneNumberTransformer: TransformerFunction = (formData) => {
    const transformedData = { ...formData };

    Object.entries(formData).forEach(([key, value]) => {
        // Assume phone fields have 'phone' in their key
        if (key.includes("phone") && value) {
            // Remove all non-numeric characters except +
            transformedData[key] = value.replace(/[^\d+]/g, "");
        }
    });

    return transformedData;
};

// Register it
transformerRegistry.register(phoneNumberTransformer);
```

---

### Example 5: Refactoring Business Rules

#### Before (Violates OCP)

```typescript
// businessRules.ts
export const shouldValidateEmailField = (
    allFormFields: FormField[],
    formData: Record<string, string>
): boolean => {
    const phoneFields = allFormFields.filter((f) => f.type === "phone");
    const hasNonIndianPhone = phoneFields.some((phoneField) => {
        const code = extractCountryCode(formData[phoneField.field_key]);
        return code !== "+91";
    });
    return hasNonIndianPhone;
};
```

#### After (Follows OCP)

**Step 1**: Create business rule registry

```typescript
// src/utils/businessRules/ruleRegistry.ts
import type { FormField } from "../../services/types";

export interface RuleContext {
    field: FormField;
    formData: Record<string, string>;
    allFormFields: FormField[];
}

export type RuleFunction = (context: RuleContext) => boolean;

class BusinessRuleRegistry {
    private rules: Map<string, RuleFunction[]> = new Map();

    /**
     * Register a business rule for a specific field key
     */
    register(fieldKey: string, rule: RuleFunction): void {
        if (!this.rules.has(fieldKey)) {
            this.rules.set(fieldKey, []);
        }
        this.rules.get(fieldKey)!.push(rule);
    }

    /**
     * Check if a field should be validated based on registered rules
     * Returns true if ANY rule returns true (OR logic)
     */
    shouldValidate(context: RuleContext): boolean {
        const rules = this.rules.get(context.field.field_key);

        if (!rules || rules.length === 0) {
            return true; // No rules = always validate
        }

        return rules.some(rule => rule(context));
    }

    /**
     * Clear all rules
     */
    clear(): void {
        this.rules.clear();
    }
}

export const businessRuleRegistry = new BusinessRuleRegistry();
```

**Step 2**: Create specific rules

```typescript
// src/utils/businessRules/rules/emailCountryRule.ts
import type { RuleFunction } from "../ruleRegistry";
import { extractCountryCode } from "../../phoneUtils";

/**
 * Email is only required if phone code is not +91 (Indian)
 */
export const emailRequiredForNonIndianPhone: RuleFunction = (context) => {
    const phoneFields = context.allFormFields.filter((f) => f.type === "phone");

    // Check if any phone field has a country code that's not +91
    const hasNonIndianPhone = phoneFields.some((phoneField) => {
        const code = extractCountryCode(context.formData[phoneField.field_key]);
        return code !== "+91";
    });

    return hasNonIndianPhone;
};

/**
 * Email always required if no phone field exists
 */
export const emailRequiredWithoutPhone: RuleFunction = (context) => {
    const phoneFields = context.allFormFields.filter((f) => f.type === "phone");
    return phoneFields.length === 0;
};
```

```typescript
// src/utils/businessRules/rules/conditionalRequiredRule.ts
import type { RuleFunction } from "../ruleRegistry";

/**
 * Factory function to create conditional required rules
 */
export const createConditionalRequiredRule = (
    dependsOnFieldKey: string,
    requiredWhen: (value: string) => boolean
): RuleFunction => {
    return (context) => {
        const dependencyValue = context.formData[dependsOnFieldKey];
        return requiredWhen(dependencyValue);
    };
};

// Example usage:
// Address is required when "needs_shipping" is "yes"
export const addressRequiredWhenShipping = createConditionalRequiredRule(
    "needs_shipping",
    (value) => value === "yes"
);
```

**Step 3**: Register rules

```typescript
// src/utils/businessRules/registerDefaultRules.ts
import { businessRuleRegistry } from "./ruleRegistry";
import {
    emailRequiredForNonIndianPhone,
    emailRequiredWithoutPhone
} from "./rules/emailCountryRule";

export const registerDefaultBusinessRules = () => {
    // Email field rules
    businessRuleRegistry.register("email", emailRequiredForNonIndianPhone);
    businessRuleRegistry.register("email", emailRequiredWithoutPhone);

    // Add more rules as needed
};
```

**Step 4**: Update validation logic

```typescript
// src/components/FormPage/hooks/useFormValidation.hook.ts
import { useEventDataContext } from "../../../contexts/eventDataContext";
import type { FormField } from "../../../services/types";
import { checkFieldConditions } from "../../../utils/fieldConditions";
import { businessRuleRegistry } from "../../../utils/businessRules/ruleRegistry";
import { validateField } from "../../../utils/validators";

export const useFormValidation = ({
    currentFields,
    formData,
}: {
    currentFields: FormField[];
    formData: Record<string, string>;
}) => {
    const eventData = useEventDataContext();

    const validateCurrentPage = (): boolean => {
        const fieldsToValidate = currentFields.filter((field) => {
            // Check standard field conditions
            if (!checkFieldConditions(field, formData, eventData.form)) {
                return false;
            }

            // Check business rules
            return businessRuleRegistry.shouldValidate({
                field,
                formData,
                allFormFields: eventData.form,
            });
        });

        const newErrors: Record<string, string> = {};
        let isValid = true;

        for (const field of fieldsToValidate) {
            const value = formData[field.field_key];
            const validation = validateField(field, value);

            if (!validation.isValid && validation.error) {
                newErrors[field.field_key] = validation.error;
                isValid = false;
            }
        }

        return isValid;
    };

    return { validateCurrentPage };
};
```

**Step 5**: Initialize rules

```typescript
// src/main.tsx
import { registerDefaultBusinessRules } from "./utils/businessRules/registerDefaultRules";

registerDefaultBusinessRules();
```

**Benefits**:
- ✅ Adding new business rules requires NO modification to validation logic
- ✅ Rules are declarative and easy to understand
- ✅ Rules can be composed and reused
- ✅ Easy to add country-specific or event-specific rules

**Adding a custom rule**:

```typescript
// Age verification rule
const ageVerificationRule: RuleFunction = (context) => {
    const age = parseInt(context.formData["age"]);
    return age >= 18; // Only validate if user is 18+
};

businessRuleRegistry.register("id_proof", ageVerificationRule);
```

---

## Best Practices

### 1. Use Dependency Injection

Instead of hardcoding dependencies, inject them:

```typescript
// Bad
export const processForm = (data: FormData) => {
    const validator = new EmailValidator(); // Hardcoded
    validator.validate(data.email);
};

// Good
export const processForm = (data: FormData, validator: Validator) => {
    validator.validate(data.email);
};
```

### 2. Prefer Composition Over Inheritance

Use composition to add functionality:

```typescript
// Instead of extending classes
class ExtendedValidator extends BaseValidator {
    // ...
}

// Use composition
const validator = new CompositeValidator([
    new RequiredValidator(),
    new EmailValidator(),
    new CustomValidator()
]);
```

### 3. Use Configuration Files

Move hardcoded values to configuration:

```typescript
// config/validation.config.ts
export const validationConfig = {
    email: {
        requiredCountryCodes: ["+1", "+44", "+61"],
        excludedCountryCodes: ["+91"]
    },
    phone: {
        minLength: 10,
        maxLength: 15
    }
};
```

### 4. Document Extension Points

Make it clear where and how to extend:

```typescript
/**
 * Custom field types can be registered here.
 *
 * @example
 * ```typescript
 * fieldRegistry.register("custom-slider", SliderComponent);
 * ```
 */
export const fieldRegistry = new FieldRegistry();
```

### 5. Test Extension Points

Write tests that verify extensibility:

```typescript
describe("Field Registry", () => {
    it("should allow registering custom field types", () => {
        const customField = () => <div>Custom</div>;
        fieldRegistry.register("custom", customField);
        expect(fieldRegistry.has("custom")).toBe(true);
    });
});
```

### 6. Use TypeScript for Type Safety

Leverage TypeScript to ensure extensions follow contracts:

```typescript
export interface FieldComponent {
    (props: FieldComponentProps): JSX.Element;
}

// TypeScript will enforce this signature
const myField: FieldComponent = (props) => {
    // Must accept FieldComponentProps
    return <div>{props.field.title}</div>;
};
```

---

## Benefits

### Short-term Benefits

1. **Fewer bugs**: Existing code doesn't change, reducing regression risk
2. **Faster development**: New features don't require understanding all existing code
3. **Easier code reviews**: Changes are localized to new files

### Long-term Benefits

1. **Maintainability**: System becomes easier to maintain as it grows
2. **Scalability**: Easy to add new features as requirements evolve
3. **Team productivity**: Multiple developers can work on different extensions simultaneously
4. **Testability**: Each extension can be tested in isolation

### Business Benefits

1. **Faster time-to-market**: New features can be added quickly
2. **Lower maintenance costs**: Less time spent fixing bugs in existing code
3. **Flexibility**: Easy to customize for different clients or use cases
4. **Reduced technical debt**: Clean architecture that doesn't accumulate cruft

---

## Migration Strategy

### Phase 1: New Code (Immediate)

- All new features should follow OCP from day one
- Use registries for new field types, validators, transformers
- Document patterns in code reviews

### Phase 2: High-Impact Areas (1-2 weeks)

1. Refactor `FormFieldsRenderer` (highest priority)
2. Refactor field condition operators
3. Refactor validators

### Phase 3: Medium-Impact Areas (2-4 weeks)

1. Refactor form data transformers
2. Refactor business rules
3. Add configuration-driven features

### Phase 4: Low-Impact Areas (As needed)

1. Refactor legacy code when touching it
2. Add tests for extension points
3. Document extension patterns

### Tips for Migration

- **Don't refactor everything at once**: Focus on high-impact areas
- **Maintain backward compatibility**: Keep old APIs during transition
- **Test thoroughly**: Ensure existing functionality still works
- **Document as you go**: Help future developers understand patterns
- **Get team buy-in**: Ensure everyone understands the benefits

---

## Conclusion

The Open/Closed Principle is fundamental to building maintainable, scalable software. By applying OCP throughout the **vecnas-curse** project, you will:

- Make it easier to add new features
- Reduce the risk of introducing bugs
- Improve code organization and readability
- Enable faster development cycles

Start small with high-impact areas like the `FormFieldsRenderer`, then gradually apply these patterns throughout the codebase. The investment in refactoring will pay dividends as the project grows.

---

## Additional Resources

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Open/Closed Principle (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2014/05/12/TheOpenClosedPrinciple.html)
- [Design Patterns: Elements of Reusable Object-Oriented Software](https://en.wikipedia.org/wiki/Design_Patterns)
- [Refactoring: Improving the Design of Existing Code](https://martinfowler.com/books/refactoring.html)

---

**Document Version**: 1.0
**Last Updated**: 2025-10-10
**Author**: Claude Code Assistant
**Project**: vecnas-curse
