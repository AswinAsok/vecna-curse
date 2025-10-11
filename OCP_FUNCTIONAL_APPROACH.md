# Open/Closed Principle - Functional Programming Approach

**For**: vecnas-curse project
**Date**: 2025-10-11
**Philosophy**: Pure functional programming without classes

---

## Table of Contents
1. [Philosophy](#philosophy)
2. [Pattern: Closure-Based Registry](#pattern-closure-based-registry)
3. [Pattern: Function Composition](#pattern-function-composition)
4. [Pattern: Higher-Order Functions](#pattern-higher-order-functions)
5. [Implementation Examples](#implementation-examples)

---

## Philosophy

Instead of using classes, we'll use:
- ✅ **Closures** for encapsulation
- ✅ **Pure functions** for logic
- ✅ **Function composition** for combining behaviors
- ✅ **Higher-order functions** for extensibility
- ✅ **Immutability** throughout

**No classes, just functions and closures.**

---

## Pattern: Closure-Based Registry

Instead of a class with methods, use a closure that returns an object with functions:

```typescript
// Instead of class Registry { ... }
const createRegistry = <T>() => {
    const registry = new Map<string, T>();

    return {
        register: (key: string, value: T) => {
            registry.set(key, value);
        },
        get: (key: string) => registry.get(key),
        has: (key: string) => registry.has(key),
        clear: () => registry.clear(),
    };
};
```

**Key benefits**:
- Private state via closure
- No `this` binding issues
- Pure functional API
- Still follows OCP

---

## Pattern: Function Composition

Chain functions together to build complex behavior:

```typescript
// Basic composition helper
const compose = <T>(...fns: Array<(arg: T) => T>) =>
    (initialValue: T) =>
        fns.reduceRight((value, fn) => fn(value), initialValue);

// Or pipe (left-to-right)
const pipe = <T>(...fns: Array<(arg: T) => T>) =>
    (initialValue: T) =>
        fns.reduce((value, fn) => fn(value), initialValue);

// Usage
const transformData = pipe(
    trimStrings,
    transformInstagram,
    transformTwitter
);
```

---

## Pattern: Higher-Order Functions

Functions that return functions for dynamic behavior:

```typescript
// Factory function
const createValidator = (predicate: (value: string) => boolean, errorMsg: string) =>
    (field: FormField, value: string) =>
        predicate(value)
            ? { isValid: true }
            : { isValid: false, error: errorMsg };

// Usage
const emailValidator = createValidator(
    (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Invalid email"
);
```

---

## Implementation Examples

### 1. Field Registry (Functional)

**Location**: `src/components/FormPage/components/fieldRegistry.ts`

#### Current (Violates OCP)
```typescript
// Must modify this object to add new types
export const fieldRegistry: Record<string, FieldComponent> = {
    text: TextField,
    email: TextField,
};
```

#### Functional Solution
```typescript
// fieldRegistry.ts
import type { FormField } from "../../../services/types";

export type FieldComponent = (props: {
    field: FormField;
    value: string;
    handleInputChange: (key: string, value: string) => void;
}) => React.ReactElement | null;

/**
 * Creates a field registry using closure for private state
 */
const createFieldRegistry = () => {
    const registry = new Map<string, FieldComponent>();

    return {
        /**
         * Register a single field type
         */
        register: (type: string, component: FieldComponent): void => {
            registry.set(type, component);
        },

        /**
         * Register multiple field types with the same component
         */
        registerMultiple: (types: string[], component: FieldComponent): void => {
            types.forEach(type => registry.set(type, component));
        },

        /**
         * Get component for a field type
         */
        get: (type: string): FieldComponent | undefined => {
            return registry.get(type);
        },

        /**
         * Check if a field type is registered
         */
        has: (type: string): boolean => {
            return registry.has(type);
        },

        /**
         * Get all registered types (useful for debugging)
         */
        getRegisteredTypes: (): string[] => {
            return Array.from(registry.keys());
        },
    };
};

// Export singleton instance
export const fieldRegistry = createFieldRegistry();
```

#### Registration File
```typescript
// registerDefaultFields.ts
import { fieldRegistry } from "./fieldRegistry";
import TextField from "./TextField";
import PhoneField from "./PhoneField";
import RadioField from "./RadioField";
import CheckboxField from "./CheckboxField";
import TextAreaField from "./TextAreaField";
import SelectField from "./SelectField";

/**
 * Register all default field types
 * Call this once at app startup
 */
export const registerDefaultFields = (): void => {
    // Text-based fields
    fieldRegistry.registerMultiple(
        ["text", "email", "number", "url"],
        TextField
    );

    // Specialized fields
    fieldRegistry.register("phone", PhoneField);
    fieldRegistry.register("radio", RadioField);
    fieldRegistry.register("checkbox", CheckboxField);
    fieldRegistry.register("textarea", TextAreaField);

    // Select fields
    fieldRegistry.registerMultiple(
        ["select", "dropdown"],
        SelectField
    );
};
```

#### Usage in Main
```typescript
// main.tsx
import { registerDefaultFields } from "./components/FormPage/components/registerDefaultFields";

// Register fields before rendering app
registerDefaultFields();

// ... rest of app
```

#### Adding New Field Types (No Code Modification!)
```typescript
// DatePickerField.tsx
import type { FieldComponent } from "./fieldRegistry";

const DatePickerField: FieldComponent = ({ field, value, handleInputChange }) => {
    return (
        <input
            type="date"
            value={value || ""}
            onChange={(e) => handleInputChange(field.field_key, e.target.value)}
        />
    );
};

// Register it (in a plugin file or main.tsx)
import { fieldRegistry } from "./fieldRegistry";
fieldRegistry.register("date", DatePickerField);
```

**Benefits**:
- ✅ No classes, pure functions
- ✅ Private state via closure
- ✅ Can extend without modifying core code
- ✅ TypeScript type safety maintained

---

### 2. Validator Registry (Functional with Composition)

**Location**: `src/utils/validation/`

#### Current (Violates OCP)
```typescript
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

#### Functional Solution

**Step 1**: Define types and create registry
```typescript
// validatorRegistry.ts
import type { FormField } from "../../services/types";

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export type ValidatorFunction = (
    field: FormField,
    value: string | undefined
) => ValidationResult;

/**
 * Creates a validator registry using closures
 */
const createValidatorRegistry = () => {
    const validators: ValidatorFunction[] = [];

    return {
        /**
         * Add a validator to the chain
         */
        register: (validator: ValidatorFunction): void => {
            validators.push(validator);
        },

        /**
         * Run all validators and return first error
         */
        validate: (field: FormField, value: string | undefined): ValidationResult => {
            for (const validator of validators) {
                const result = validator(field, value);
                if (!result.isValid) {
                    return result;
                }
            }
            return { isValid: true };
        },

        /**
         * Clear all validators (useful for testing)
         */
        clear: (): void => {
            validators.length = 0;
        },

        /**
         * Get count of registered validators
         */
        count: (): number => validators.length,
    };
};

export const validatorRegistry = createValidatorRegistry();
```

**Step 2**: Create individual validators as pure functions
```typescript
// validators/requiredValidator.ts
import type { ValidatorFunction } from "../validatorRegistry";

export const requiredValidator: ValidatorFunction = (field, value) => {
    if (!field.required) {
        return { isValid: true };
    }

    const hasValue = Boolean(value && value.trim() !== "");

    return hasValue
        ? { isValid: true }
        : { isValid: false, error: "This field is required" };
};
```

```typescript
// validators/emailValidator.ts
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
// validators/phoneValidator.ts
import type { ValidatorFunction } from "../validatorRegistry";

export const phoneValidator: ValidatorFunction = (field, value) => {
    if (field.type !== "phone" || !value || value.trim() === "") {
        return { isValid: true };
    }

    // Extract just numbers and +
    const cleaned = value.replace(/[\s()-]/g, "");
    const isValid = /^\+?[1-9]\d{7,14}$/.test(cleaned);

    return isValid
        ? { isValid: true }
        : { isValid: false, error: "Please enter a valid phone number" };
};
```

```typescript
// validators/urlValidator.ts
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

**Step 3**: Higher-order function for custom validators
```typescript
// validators/createCustomValidator.ts
import type { ValidatorFunction } from "../validatorRegistry";

/**
 * Factory function to create custom validators
 */
export const createCustomValidator = (
    shouldValidate: (field: FormField) => boolean,
    isValid: (value: string) => boolean,
    errorMessage: string
): ValidatorFunction => {
    return (field, value) => {
        if (!shouldValidate(field) || !value || value.trim() === "") {
            return { isValid: true };
        }

        return isValid(value)
            ? { isValid: true }
            : { isValid: false, error: errorMessage };
    };
};

// Example: Create a min-length validator
export const createMinLengthValidator = (minLength: number): ValidatorFunction =>
    createCustomValidator(
        (field) => true, // apply to all fields
        (value) => value.length >= minLength,
        `Minimum length is ${minLength} characters`
    );

// Example: Create a regex validator
export const createRegexValidator = (
    fieldType: string,
    regex: RegExp,
    errorMessage: string
): ValidatorFunction =>
    createCustomValidator(
        (field) => field.type === fieldType,
        (value) => regex.test(value),
        errorMessage
    );
```

**Step 4**: Register validators
```typescript
// registerDefaultValidators.ts
import { validatorRegistry } from "./validatorRegistry";
import { requiredValidator } from "./validators/requiredValidator";
import { emailValidator } from "./validators/emailValidator";
import { phoneValidator } from "./validators/phoneValidator";
import { urlValidator } from "./validators/urlValidator";

export const registerDefaultValidators = (): void => {
    // Order matters - required should be checked first
    validatorRegistry.register(requiredValidator);
    validatorRegistry.register(emailValidator);
    validatorRegistry.register(phoneValidator);
    validatorRegistry.register(urlValidator);
};
```

**Step 5**: Update validators.ts
```typescript
// validators.ts
import { validatorRegistry } from "./validation/validatorRegistry";
import type { FormField } from "../services/types";
import type { ValidationResult } from "./validation/validatorRegistry";

export const validateField = (
    field: FormField,
    value: string | undefined
): ValidationResult => {
    return validatorRegistry.validate(field, value);
};

// Keep helper functions for backward compatibility
export const isRequiredFieldValid = (value: string | undefined): boolean => {
    return Boolean(value && value.trim() !== "");
};

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};
```

**Step 6**: Initialize in main.tsx
```typescript
// main.tsx
import { registerDefaultValidators } from "./utils/validation/registerDefaultValidators";

registerDefaultValidators();
```

**Adding Custom Validators** (No code modification!)
```typescript
// Custom validator using factory
import { createRegexValidator } from "./validators/createCustomValidator";
import { validatorRegistry } from "./validatorRegistry";

const zipCodeValidator = createRegexValidator(
    "zipcode",
    /^\d{5}(-\d{4})?$/,
    "Please enter a valid ZIP code"
);

validatorRegistry.register(zipCodeValidator);

// Or create completely custom validator
const ageValidator: ValidatorFunction = (field, value) => {
    if (field.field_key !== "age" || !value) {
        return { isValid: true };
    }

    const age = parseInt(value, 10);
    const isValid = age >= 18 && age <= 120;

    return isValid
        ? { isValid: true }
        : { isValid: false, error: "Age must be between 18 and 120" };
};

validatorRegistry.register(ageValidator);
```

**Benefits**:
- ✅ Pure functions only
- ✅ Validators are composable
- ✅ Easy to add custom validators
- ✅ No code modification needed

---

### 3. Operator Registry (Functional)

**Location**: `src/utils/conditions/`

#### Current (Violates OCP)
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

#### Functional Solution

```typescript
// operatorRegistry.ts
export type OperatorFunction = (currentValue: string, conditionValue: string) => boolean;

/**
 * Creates an operator registry using closures
 */
const createOperatorRegistry = () => {
    const operators = new Map<string, OperatorFunction>();

    return {
        register: (operator: string, fn: OperatorFunction): void => {
            operators.set(operator, fn);
        },

        evaluate: (operator: string, currentValue: string, conditionValue: string): boolean => {
            const fn = operators.get(operator);

            if (!fn) {
                console.warn(`Unknown operator: ${operator}, defaulting to true`);
                return true;
            }

            return fn(currentValue, conditionValue);
        },

        has: (operator: string): boolean => operators.has(operator),
    };
};

export const operatorRegistry = createOperatorRegistry();
```

```typescript
// registerDefaultOperators.ts
import { operatorRegistry } from "./operatorRegistry";

export const registerDefaultOperators = (): void => {
    // Equality operators
    operatorRegistry.register("=", (current, condition) => current === condition);
    operatorRegistry.register("!=", (current, condition) => current !== condition);

    // Comparison operators
    operatorRegistry.register(">", (current, condition) =>
        parseFloat(current) > parseFloat(condition)
    );
    operatorRegistry.register("<", (current, condition) =>
        parseFloat(current) < parseFloat(condition)
    );
    operatorRegistry.register(">=", (current, condition) =>
        parseFloat(current) >= parseFloat(condition)
    );
    operatorRegistry.register("<=", (current, condition) =>
        parseFloat(current) <= parseFloat(condition)
    );

    // String operators
    operatorRegistry.register("contains", (current, condition) =>
        current.toLowerCase().includes(condition.toLowerCase())
    );
    operatorRegistry.register("startsWith", (current, condition) =>
        current.toLowerCase().startsWith(condition.toLowerCase())
    );
    operatorRegistry.register("endsWith", (current, condition) =>
        current.toLowerCase().endsWith(condition.toLowerCase())
    );

    // Regex operator
    operatorRegistry.register("matches", (current, condition) => {
        try {
            return new RegExp(condition).test(current);
        } catch {
            console.error("Invalid regex:", condition);
            return false;
        }
    });

    // Empty check
    operatorRegistry.register("isEmpty", (current, condition) => {
        const isEmpty = !current || current.trim() === "";
        return condition === "true" ? isEmpty : !isEmpty;
    });
};
```

```typescript
// Update fieldConditions.ts
import { operatorRegistry } from "./conditions/operatorRegistry";

export const checkFieldConditions = (
    field: FormField,
    formData: Record<string, string>,
    allFormFields: FormField[]
): boolean => {
    if (!field.conditions || Object.keys(field.conditions).length === 0) {
        return true;
    }

    const { field: fieldId, value: conditionValue, operator } = field.conditions as {
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

    // Use operator registry instead of switch
    return operatorRegistry.evaluate(operator, currentValue, conditionValue);
};
```

**Adding Custom Operators** (No code modification!)
```typescript
// Custom operator
operatorRegistry.register("divisibleBy", (current, condition) => {
    const num = parseFloat(current);
    const divisor = parseFloat(condition);
    return num % divisor === 0;
});

// Now you can use: { operator: "divisibleBy", value: "5" }
```

---

### 4. Transformer Registry (Functional Composition)

**Location**: `src/utils/transformers/`

#### Current (Violates OCP)
```typescript
export const transformInstagramFields = (formData: Record<string, string>) => {
    const instagramFieldKeys = ["__vecna_sees_your_instagram_id", "partner_instagram_id"];
    // Hardcoded transformation
};

// Usage - must manually chain
const result = trimFormData(transformInstagramFields(formData));
```

#### Functional Solution

```typescript
// transformerRegistry.ts
export type TransformerFunction = (formData: Record<string, string>) => Record<string, string>;

/**
 * Creates a transformer registry using closures and composition
 */
const createTransformerRegistry = () => {
    const transformers: TransformerFunction[] = [];

    return {
        /**
         * Register a transformer
         */
        register: (transformer: TransformerFunction): void => {
            transformers.push(transformer);
        },

        /**
         * Apply all registered transformers in order
         * Uses function composition (pipeline)
         */
        transform: (formData: Record<string, string>): Record<string, string> => {
            return transformers.reduce(
                (data, transformer) => transformer(data),
                formData
            );
        },

        /**
         * Clear all transformers
         */
        clear: (): void => {
            transformers.length = 0;
        },

        /**
         * Get count of registered transformers
         */
        count: (): number => transformers.length,
    };
};

export const transformerRegistry = createTransformerRegistry();
```

```typescript
// transformers/trimTransformer.ts
import type { TransformerFunction } from "../transformerRegistry";

export const trimTransformer: TransformerFunction = (formData) => {
    const trimmedData: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
        trimmedData[key] = typeof value === "string" ? value.trim() : value;
    });

    return trimmedData;
};
```

```typescript
// transformers/socialMediaTransformers.ts
import type { TransformerFunction } from "../transformerRegistry";

/**
 * Higher-order function to create social media transformers
 */
const createSocialMediaTransformer = (
    fieldKeys: string[],
    baseUrl: string,
    cleanupPattern?: RegExp
): TransformerFunction => {
    return (formData) => {
        const transformed = { ...formData };

        fieldKeys.forEach((fieldKey) => {
            const value = transformed[fieldKey];

            if (!value || value.trim() === "") {
                return;
            }

            let cleanId = value.trim();

            // Remove @ symbol
            cleanId = cleanId.replace(/^@/, "");

            // Remove existing profile URLs
            if (cleanupPattern) {
                cleanId = cleanId.replace(cleanupPattern, "");
            }

            // Only transform if not already a full URL
            if (!cleanId.startsWith("http")) {
                transformed[fieldKey] = `${baseUrl}${cleanId}`;
            }
        });

        return transformed;
    };
};

// Instagram transformer
export const instagramTransformer = createSocialMediaTransformer(
    ["__vecna_sees_your_instagram_id", "partner_instagram_id"],
    "https://www.instagram.com/",
    /^https?:\/\/(www\.)?instagram\.com\//i
);

// Twitter transformer
export const twitterTransformer = createSocialMediaTransformer(
    ["twitter_handle", "partner_twitter"],
    "https://twitter.com/",
    /^https?:\/\/(www\.)?(twitter|x)\.com\//i
);

// LinkedIn transformer
export const linkedinTransformer = createSocialMediaTransformer(
    ["linkedin_profile", "partner_linkedin"],
    "https://www.linkedin.com/in/",
    /^https?:\/\/(www\.)?linkedin\.com\/in\//i
);
```

```typescript
// registerDefaultTransformers.ts
import { transformerRegistry } from "./transformerRegistry";
import { trimTransformer } from "./transformers/trimTransformer";
import {
    instagramTransformer,
    twitterTransformer,
    linkedinTransformer
} from "./transformers/socialMediaTransformers";

export const registerDefaultTransformers = (): void => {
    // Order matters!
    transformerRegistry.register(trimTransformer);
    transformerRegistry.register(instagramTransformer);
    transformerRegistry.register(twitterTransformer);
    transformerRegistry.register(linkedinTransformer);
};
```

```typescript
// Update formDataTransformers.ts
import { transformerRegistry } from "./transformers/transformerRegistry";

/**
 * Apply all registered transformers
 */
export const transformFormData = (
    formData: Record<string, string>
): Record<string, string> => {
    return transformerRegistry.transform(formData);
};

// Keep legacy functions for backward compatibility if needed
export const transformInstagramFields = (formData: Record<string, string>) => {
    // ... existing implementation
};

export const trimFormData = (formData: Record<string, string>) => {
    // ... existing implementation
};
```

**New Usage** (clean and composable):
```typescript
// Before (manual chaining)
const preparedData = trimFormData(transformInstagramFields(formData));

// After (automatic pipeline)
import { transformFormData } from "../utils/formDataTransformers";
const preparedData = transformFormData(formData);
```

**Adding Custom Transformers** (No code modification!)
```typescript
// Custom transformer for phone numbers
const phoneNumberTransformer: TransformerFunction = (formData) => {
    const transformed = { ...formData };

    Object.entries(formData).forEach(([key, value]) => {
        if (key.includes("phone") && value) {
            // Remove all non-numeric except +
            transformed[key] = value.replace(/[^\d+]/g, "");
        }
    });

    return transformed;
};

transformerRegistry.register(phoneNumberTransformer);
```

---

### 5. Business Rule Registry (Functional Predicates)

**Location**: `src/utils/businessRules/`

#### Current (Violates OCP)
```typescript
// Hardcoded in multiple places
if (field.field_key === "email") {
    const hasNonIndianPhone = phoneFields.some((phoneField) => {
        const code = extractCountryCode(formData[phoneField.field_key]);
        return code !== "+91"; // Hardcoded
    });
    return hasNonIndianPhone;
}
```

#### Functional Solution

```typescript
// ruleRegistry.ts
import type { FormField } from "../../services/types";

export interface RuleContext {
    field: FormField;
    formData: Record<string, string>;
    allFormFields: FormField[];
}

export type RuleFunction = (context: RuleContext) => boolean;

/**
 * Creates a business rule registry using closures
 */
const createBusinessRuleRegistry = () => {
    const rules = new Map<string, RuleFunction[]>();

    return {
        /**
         * Register a rule for a specific field key
         */
        register: (fieldKey: string, rule: RuleFunction): void => {
            if (!rules.has(fieldKey)) {
                rules.set(fieldKey, []);
            }
            rules.get(fieldKey)!.push(rule);
        },

        /**
         * Check if a field should be validated
         * Returns true if ANY rule returns true (OR logic)
         */
        shouldValidate: (context: RuleContext): boolean => {
            const fieldRules = rules.get(context.field.field_key);

            if (!fieldRules || fieldRules.length === 0) {
                return true; // No rules = always validate
            }

            return fieldRules.some(rule => rule(context));
        },

        /**
         * Clear all rules
         */
        clear: (): void => {
            rules.clear();
        },
    };
};

export const businessRuleRegistry = createBusinessRuleRegistry();
```

```typescript
// rules/emailCountryRule.ts
import type { RuleFunction } from "../ruleRegistry";
import { extractCountryCode } from "../../phoneUtils";

/**
 * Email required for non-Indian phone codes
 */
export const emailRequiredForNonIndianPhone: RuleFunction = (context) => {
    const phoneFields = context.allFormFields.filter((f) => f.type === "phone");

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
// rules/createConditionalRule.ts (Higher-order function)
import type { RuleFunction } from "../ruleRegistry";

/**
 * Factory to create conditional rules
 */
export const createConditionalRule = (
    dependsOnFieldKey: string,
    shouldValidateWhen: (value: string) => boolean
): RuleFunction => {
    return (context) => {
        const dependencyValue = context.formData[dependsOnFieldKey];
        return shouldValidateWhen(dependencyValue);
    };
};

// Example usage
export const addressRequiredWhenShipping = createConditionalRule(
    "needs_shipping",
    (value) => value === "yes"
);
```

```typescript
// registerDefaultRules.ts
import { businessRuleRegistry } from "./ruleRegistry";
import {
    emailRequiredForNonIndianPhone,
    emailRequiredWithoutPhone
} from "./rules/emailCountryRule";

export const registerDefaultBusinessRules = (): void => {
    // Email field rules
    businessRuleRegistry.register("email", emailRequiredForNonIndianPhone);
    businessRuleRegistry.register("email", emailRequiredWithoutPhone);
};
```

```typescript
// Update useFormValidation.hook.ts
import { businessRuleRegistry } from "../../../utils/businessRules/ruleRegistry";

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

        // ... rest of validation logic
    };

    return { validateCurrentPage };
};
```

**Adding Custom Rules** (No code modification!)
```typescript
// Age verification rule
const ageVerificationRule: RuleFunction = (context) => {
    const age = parseInt(context.formData["age"] || "0", 10);
    return age >= 18;
};

businessRuleRegistry.register("id_proof", ageVerificationRule);

// Using factory
const phoneRequiredForUSA = createConditionalRule(
    "country",
    (value) => value === "USA"
);

businessRuleRegistry.register("phone", phoneRequiredForUSA);
```

---

## Summary: Functional vs Class Approach

| Aspect | Class Approach | Functional Approach |
|--------|---------------|---------------------|
| **State** | Private class fields | Closure variables |
| **Methods** | Class methods | Functions in object |
| **Instance** | `new ClassName()` | `createFactory()` |
| **This binding** | Can be problematic | No `this` issues |
| **Testing** | Mock instances | Mock functions |
| **Composition** | Inheritance | Function composition |

Both achieve OCP, but functional is more idiomatic for React/TypeScript projects.

---

## Implementation Checklist

### Phase 1: Field Registry (2-3 hours)
- [ ] Create `createFieldRegistry()` function
- [ ] Update `fieldRegistry.ts` to use closure
- [ ] Create `registerDefaultFields.ts`
- [ ] Update `main.tsx` to call registration
- [ ] Test adding new field type

### Phase 2: Validator Registry (4-6 hours)
- [ ] Create `createValidatorRegistry()` function
- [ ] Create individual validator functions
- [ ] Create `createCustomValidator()` HOF
- [ ] Create `registerDefaultValidators.ts`
- [ ] Update `validators.ts` to use registry
- [ ] Update `main.tsx` to call registration

### Phase 3: Operator Registry (3-4 hours)
- [ ] Create `createOperatorRegistry()` function
- [ ] Create `registerDefaultOperators.ts`
- [ ] Update `fieldConditions.ts` to use registry
- [ ] Update `main.tsx` to call registration

### Phase 4: Transformer Registry (3-4 hours)
- [ ] Create `createTransformerRegistry()` function
- [ ] Create individual transformer functions
- [ ] Create HOF for social media transformers
- [ ] Create `registerDefaultTransformers.ts`
- [ ] Update `formDataTransformers.ts`
- [ ] Update form submission to use registry

### Phase 5: Business Rule Registry (3-4 hours)
- [ ] Create `createBusinessRuleRegistry()` function
- [ ] Create rule functions
- [ ] Create `createConditionalRule()` HOF
- [ ] Create `registerDefaultRules.ts`
- [ ] Update `useFormValidation.hook.ts`
- [ ] Remove duplicated rule logic

---

## Benefits of Functional Approach

✅ **No classes** - Pure functional style
✅ **No `this` issues** - Everything is explicit
✅ **Easy composition** - Functions compose naturally
✅ **Immutability** - Data flows through pure functions
✅ **Testing** - Simple function mocking
✅ **TypeScript** - Great type inference
✅ **React idiomatic** - Matches React's functional style

---

## File Structure

```
src/
├── components/
│   └── FormPage/
│       └── components/
│           ├── fieldRegistry.ts (closure-based)
│           └── registerDefaultFields.ts (NEW)
├── utils/
│   ├── validation/
│   │   ├── validatorRegistry.ts (closure-based)
│   │   ├── validators/
│   │   │   ├── requiredValidator.ts
│   │   │   ├── emailValidator.ts
│   │   │   ├── phoneValidator.ts
│   │   │   ├── urlValidator.ts
│   │   │   └── createCustomValidator.ts (HOF)
│   │   └── registerDefaultValidators.ts (NEW)
│   ├── conditions/
│   │   ├── operatorRegistry.ts (closure-based)
│   │   └── registerDefaultOperators.ts (NEW)
│   ├── transformers/
│   │   ├── transformerRegistry.ts (closure-based)
│   │   ├── transformers/
│   │   │   ├── trimTransformer.ts
│   │   │   └── socialMediaTransformers.ts (HOFs)
│   │   └── registerDefaultTransformers.ts (NEW)
│   └── businessRules/
│       ├── ruleRegistry.ts (closure-based)
│       ├── rules/
│       │   ├── emailCountryRule.ts
│       │   └── createConditionalRule.ts (HOF)
│       └── registerDefaultRules.ts (NEW)
└── main.tsx (register all)
```

---

## Next Steps

1. **Start with Field Registry** - Quick win, sets pattern
2. **Then Validators** - Highest impact
3. **Then Operators** - Adds flexibility
4. **Then Transformers** - Cleaner data pipeline
5. **Finally Rules** - Removes duplication

**Total Effort**: 15-21 hours (vs 24-34 with classes)
**Philosophy**: Pure functions, closures, and composition all the way!

---

**Questions? Start with the Field Registry example - it's the simplest and shows the pattern clearly.**
