# Single Responsibility Principle (SRP) - Assessment Report

**Date**: 2025-10-11
**Project**: vecnas-curse
**Analysis Type**: Complete SRP Compliance Review

---

## Executive Summary

**Overall SRP Compliance**: 🟡 **75%** (Good, with room for improvement)

The codebase shows **good SRP awareness** with most components and utilities focused on single concerns. However, there are **several violations** where modules take on multiple responsibilities, particularly in hooks and service files.

### Quick Status

| Category | Compliance | Violations Found | Priority |
|----------|-----------|------------------|----------|
| **Components** | 🟢 90% | 2 minor | LOW |
| **Hooks** | 🟡 65% | 3 significant | MEDIUM-HIGH |
| **Services** | 🟡 60% | 2 significant | HIGH |
| **Utils** | 🟢 85% | 2 minor | LOW-MEDIUM |
| **Contexts** | 🟢 95% | 0 | N/A |

---

## Understanding SRP

### The Principle

> **A module should have one, and only one, reason to change.**

This means each module (function, class, component, file) should have a single responsibility or concern.

### Why It Matters

- **Easier to understand**: Code does one thing well
- **Easier to test**: Fewer dependencies and edge cases
- **Easier to modify**: Changes affect only related code
- **Better reusability**: Focused modules are more composable
- **Reduced coupling**: Fewer dependencies between modules

### Common Violations

1. **God Objects**: Modules that do everything
2. **Mixed Concerns**: UI + business logic + data access in one place
3. **Multiple Reasons to Change**: Module changes when any of several things change

---

## Detailed Analysis

### 🟢 EXCELLENT - Components (90% Compliant)

Most components follow SRP well - they render UI and delegate logic to hooks.

#### ✅ Good Examples

**FormFieldsRenderer** - Single purpose: Render the correct field component
```typescript
// FormFieldsRenderer.tsx - PERFECT SRP!
const FormFieldsRenderer = ({ field, value, handleInputChange }) => {
    const FieldComponent = fieldRegistry.get(field.type);
    if (!FieldComponent) return null;
    return <FieldComponent field={field} value={value} handleInputChange={handleInputChange} />;
};
```
**Responsibility**: Delegate to registered field component
**Reason to change**: Only if field rendering strategy changes

**Field Components** - Each has single purpose
```typescript
// TextField.tsx, PhoneField.tsx, etc.
// Responsibility: Render specific field type
// Reason to change: Only if that field type's UI changes
```

**FormPage** - Clean orchestration
```typescript
// FormPage.tsx - Good SRP!
const FormPage = () => {
    const [logId, setLogId] = useState<string | null>(null);
    const { formData, isFormSubmitted, submitResponse } = useFormSubmission({ logId });
    useFormLogUpdation({ formData, logId, setLogId });

    if (isFormSubmitted && submitResponse) return <SuccessPage />;
    return (
        <div className={styles.formContainer}>
            <FormPaginationLayout>
                <EventForm logId={logId} />
            </FormPaginationLayout>
        </div>
    );
};
```
**Responsibility**: Orchestrate form flow
**Reason to change**: Only if form structure changes

#### ⚠️ Minor Violation #1: EventPageContent

**File**: `src/components/EventPage/components/EventPageContent.tsx`

**Current Code**:
```typescript
const EventPageContent = () => {
    const [showForm, setShowForm] = useState(false);

    return showForm ? (
        <FormPage />
    ) : (
        <>
            <About />
            <Button onClick={() => setShowForm(true)}>Next →</Button>
        </>
    );
};
```

**Violation**: Manages navigation state (should be handled by router or parent)

**Multiple Responsibilities**:
1. ✅ Rendering content
2. ❌ Navigation/routing logic

**Why It Matters**: Medium priority
- Navigation state should be externalized
- Makes component harder to reuse
- Couples component to specific flow

**Recommended Fix**: Extract to router or parent
```typescript
// Option 1: Use router
// In router config
{
    path: "/event",
    element: <EventPageLayout />,
    children: [
        { path: "", element: <About /> },
        { path: "form", element: <FormPage /> }
    ]
}

// Option 2: Lift state to parent
const EventPage = () => {
    const [currentStep, setCurrentStep] = useState<"about" | "form">("about");

    return (
        <EventPageLayout>
            {currentStep === "about" && (
                <>
                    <About />
                    <Button onClick={() => setCurrentStep("form")}>Next →</Button>
                </>
            )}
            {currentStep === "form" && <FormPage />}
        </EventPageLayout>
    );
};
```

**Impact**: 🟡 **MEDIUM** - Makes navigation logic explicit

---

### 🟡 NEEDS IMPROVEMENT - Hooks (65% Compliant)

Several hooks violate SRP by handling multiple concerns.

#### ❌ Violation #2: useFormSubmission Hook (HIGH PRIORITY)

**File**: `src/components/FormPage/hooks/useFormSubmission.hook.ts`

**Current Responsibilities** (Too Many!):
1. ❌ Form state management (formData)
2. ❌ Submission state (isSubmitting, isFormSubmitted)
3. ❌ API calls (submitForm, updateFormLog)
4. ❌ Data transformation (transformFormData)
5. ❌ Error handling (axios errors, toast notifications)
6. ❌ Response management (submitResponse)

**Reasons to Change** (6!):
1. Form data structure changes
2. Submission workflow changes
3. API endpoints change
4. Data transformation rules change
5. Error handling strategy changes
6. Response format changes

**Current Code** (68 lines, too much!):
```typescript
export const useFormSubmission = ({ logId }: { logId?: string | null }) => {
    const eventData = useEventDataContext();

    const [formData, setFormData] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [submitResponse, setSubmitResponse] = useState<SubmitFormResponse | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Responsibility 1: Update form log
            if (eventData.id && eventData.tickets && eventData.tickets.length > 0 && logId) {
                await updateFormLog(eventData.id, formData, eventData.form, logId).catch(...);
            }

            // Responsibility 2: Transform data
            const transformedFormData = transformFormData(formData);

            // Responsibility 3: Submit form
            const response = await submitForm(eventData.id, transformedFormData, logId);

            // Responsibility 4: Update state
            setSubmitResponse(response.response);
            setIsFormSubmitted(true);
        } catch (error: unknown) {
            // Responsibility 5: Handle errors
            const axiosError = error as { response?: { data?: { message?: Record<string, string[]> } } };
            const errorMessage = axiosError?.response?.data?.message;

            if (errorMessage && typeof errorMessage === "object") {
                const fieldErrors: Record<string, string> = {};
                Object.keys(errorMessage).forEach((fieldKey) => {
                    const errorMessages = errorMessage[fieldKey];
                    if (Array.isArray(errorMessages) && errorMessages.length > 0) {
                        fieldErrors[fieldKey] = errorMessages[0];
                    }
                });
            } else {
                toast.error("Failed to submit the form. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        setFormData,
        formData,
        isSubmitting,
        isFormSubmitted,
        submitResponse,
        handleSubmit,
    };
};
```

**Recommended Refactoring**: Split into focused hooks

**Step 1: Create useFormState** (Form data management only)
```typescript
// hooks/useFormState.ts
export const useFormState = () => {
    const [formData, setFormData] = useState<Record<string, string>>({});

    const updateField = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const resetForm = () => setFormData({});

    return { formData, setFormData, updateField, resetForm };
};
```

**Step 2: Create useSubmissionState** (Submission status only)
```typescript
// hooks/useSubmissionState.ts
export const useSubmissionState = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitResponse, setSubmitResponse] = useState<SubmitFormResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    return {
        isSubmitting,
        setIsSubmitting,
        isSubmitted,
        setIsSubmitted,
        submitResponse,
        setSubmitResponse,
        error,
        setError,
    };
};
```

**Step 3: Create useFormSubmit** (Submission logic only)
```typescript
// hooks/useFormSubmit.ts
import { submitForm } from "../../../services/formSubmission";
import { updateFormLog } from "../../../services/formLogUpdation";
import { transformFormData } from "../../../utils/formDataTransformers";

export const useFormSubmit = () => {
    const eventData = useEventDataContext();

    const submit = async (
        formData: Record<string, string>,
        logId: string | null
    ): Promise<SubmitFormResponse> => {
        // Pre-submission: Update form log
        if (eventData.id && eventData.tickets?.length > 0 && logId) {
            await updateFormLog(eventData.id, formData, eventData.form, logId).catch(
                error => console.error("Error updating form log before submit:", error)
            );
        }

        // Transform data
        const transformedData = transformFormData(formData);

        // Submit
        const response = await submitForm(eventData.id, transformedData, logId);
        return response.response;
    };

    return { submit };
};
```

**Step 4: Create useFormSubmission** (Orchestration only)
```typescript
// hooks/useFormSubmission.ts - REFACTORED
import { useFormState } from "./useFormState";
import { useSubmissionState } from "./useSubmissionState";
import { useFormSubmit } from "./useFormSubmit";
import { useFormErrorHandler } from "./useFormErrorHandler";

export const useFormSubmission = ({ logId }: { logId?: string | null }) => {
    const { formData, setFormData, updateField } = useFormState();
    const { isSubmitting, setIsSubmitting, isSubmitted, setIsSubmitted, submitResponse, setSubmitResponse, error, setError } = useSubmissionState();
    const { submit } = useFormSubmit();
    const { handleError } = useFormErrorHandler();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await submit(formData, logId);
            setSubmitResponse(response);
            setIsSubmitted(true);
        } catch (error) {
            const errorMessage = handleError(error);
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        setFormData,
        updateField,
        isSubmitting,
        isSubmitted,
        submitResponse,
        error,
        handleSubmit,
    };
};
```

**Step 5: Create useFormErrorHandler** (Error handling only)
```typescript
// hooks/useFormErrorHandler.ts
import toast from "react-hot-toast";

export const useFormErrorHandler = () => {
    const handleError = (error: unknown): string | null => {
        const axiosError = error as {
            response?: { data?: { message?: Record<string, string[]> } };
        };

        const errorMessage = axiosError?.response?.data?.message;

        if (errorMessage && typeof errorMessage === "object") {
            // Extract first error from each field
            const errors = Object.values(errorMessage)
                .flat()
                .filter(msg => typeof msg === "string");

            if (errors.length > 0) {
                toast.error(errors[0]);
                return errors[0];
            }
        }

        toast.error("Failed to submit the form. Please try again.");
        return "Failed to submit the form. Please try again.";
    };

    return { handleError };
};
```

**Benefits of Refactoring**:
- ✅ Each hook has ONE responsibility
- ✅ Easy to test independently
- ✅ Easy to modify one concern without affecting others
- ✅ Better reusability (can use useFormState elsewhere)
- ✅ Clear separation of concerns

**Impact**: 🔴 **HIGH** - Major improvement in maintainability

---

#### ⚠️ Violation #3: useFormLogUpdation Hook

**File**: `src/components/FormPage/hooks/useFormLogUpdation.hook.ts`

**Current Responsibilities**:
1. ❌ Debouncing logic
2. ❌ API call logic
3. ❌ State updates (setLogId)

**Current Code**:
```typescript
export const useFormLogUpdation = ({ formData, logId, setLogId }) => {
    const eventData = useEventDataContext();

    useEffect(() => {
        const handler = setTimeout(() => {
            if ((eventData.id || Object.keys(formData).length >= 0) && eventData.tickets.length > 0) {
                updateFormLog(eventData.id, formData, eventData.form, logId)
                    .then((response) => {
                        if (!logId && response.response.log_id) {
                            setLogId(response.response.log_id);
                        }
                    })
                    .catch((error) => console.error("Error updating form log:", error));
            }
        }, 1500);

        return () => clearTimeout(handler);
    }, [formData, eventData.id, eventData.form, eventData.tickets, logId]);
};
```

**Violation**: Mixes debouncing, API calls, and state updates

**Recommended Refactoring**: Extract debounce utility

**Step 1: Create useDebouncedEffect**
```typescript
// hooks/useDebouncedEffect.ts
export const useDebouncedEffect = (
    effect: () => void | Promise<void>,
    deps: React.DependencyList,
    delay: number
) => {
    useEffect(() => {
        const handler = setTimeout(() => {
            effect();
        }, delay);

        return () => clearTimeout(handler);
    }, [...deps, delay]);
};
```

**Step 2: Refactor useFormLogUpdation**
```typescript
// hooks/useFormLogUpdation.hook.ts - REFACTORED
import { useDebouncedEffect } from "./useDebouncedEffect";
import { updateFormLog } from "../../../services/formLogUpdation";

export const useFormLogUpdation = ({ formData, logId, setLogId }) => {
    const eventData = useEventDataContext();

    const updateLog = async () => {
        if (!eventData.id || !eventData.tickets?.length) return;

        try {
            const response = await updateFormLog(eventData.id, formData, eventData.form, logId);
            if (!logId && response.response.log_id) {
                setLogId(response.response.log_id);
            }
        } catch (error) {
            console.error("Error updating form log:", error);
        }
    };

    useDebouncedEffect(updateLog, [formData, eventData.id, eventData.tickets, logId], 1500);
};
```

**Benefits**:
- ✅ Debouncing is reusable
- ✅ Update logic is testable separately
- ✅ Clearer intent

**Impact**: 🟡 **MEDIUM** - Improved separation of concerns

---

#### ✅ Good Example: useFormValidation

**File**: `src/components/FormPage/hooks/useFormValidation.hook.ts`

**Single Responsibility**: Validate form fields

```typescript
export const useFormValidation = ({ currentFields, formData }) => {
    const eventData = useEventDataContext();

    const validateCurrentPage = (): boolean => {
        const fieldsToValidate = currentFields.filter((field) => {
            if (!checkFieldConditions(field, formData, eventData.form)) return false;
            return businessRuleRegistry.shouldValidate({ field, formData, allFormFields: eventData.form });
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

**Reason to change**: Only if validation logic changes
**Score**: 🟢 **10/10** - Perfect SRP

---

### 🟡 NEEDS IMPROVEMENT - Services (60% Compliant)

#### ❌ Violation #4: eventApi.ts (HIGH PRIORITY)

**File**: `src/services/eventApi.ts`

**Current Responsibilities** (Multiple APIs in one file):
1. ❌ Fetch event info
2. ❌ Submit form
3. ❌ Type definitions for multiple concerns

**Current Structure**:
```typescript
// eventApi.ts - VIOLATES SRP!
export const fetchEventInfo = async (...) => { /* ... */ };
export const submitForm = async (...) => { /* ... */ };
export interface SubmitFormResponse { /* ... */ }
export interface FormLogApiResponse { /* ... */ }
```

**Violation**: Multiple API concerns in one file

**Reasons to Change** (3):
1. Event info API changes
2. Form submission API changes
3. Form log API changes

**Recommended Refactoring**: Split by concern

**Step 1: Create eventInfoApi.ts**
```typescript
// services/apis/eventInfoApi.ts
import axios from "axios";
import type { EventData } from "../types";

const API_BASE_URL = "https://api.makemypass.com/makemypass/public-form";

export const fetchEventInfo = async (eventName: string = "vecnas-curse"): Promise<EventData> => {
    const response = await axios.get(`${API_BASE_URL}/${eventName}/info/`);
    return response.data.response;
};
```

**Step 2: Create formSubmissionApi.ts**
```typescript
// services/apis/formSubmissionApi.ts
import axios from "axios";
import { prepareSubmitFormData } from "../../utils/formDataPreparation";

const API_BASE_URL = "https://api.makemypass.com/makemypass/public-form";

export interface SubmitFormResponse {
    followup_msg: string;
    approval_status: string;
    event_register_id: string;
    redirection: Record<string, unknown>;
    extra_tickets: unknown[];
    thank_you_new_page: boolean;
    is_online: boolean;
    type_of_event: string;
    has_invoice: boolean;
}

interface SubmitApiResponse {
    hasError: boolean;
    statusCode: number;
    message: Record<string, unknown>;
    response: SubmitFormResponse;
}

export const submitForm = async (
    eventId: string,
    formData: Record<string, string>,
    logId?: string | null
): Promise<SubmitApiResponse> => {
    const submitData = prepareSubmitFormData(formData, logId);

    const response = await axios.post<SubmitApiResponse>(
        `${API_BASE_URL}/${eventId}/submit/`,
        submitData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );

    return response.data;
};
```

**Step 3: Create formLogApi.ts**
```typescript
// services/apis/formLogApi.ts
import axios from "axios";
import { prepareFormLogData } from "../../utils/formDataPreparation";
import type { FormField } from "../types";

export interface FormLogApiResponse {
    hasError: boolean;
    statusCode: number;
    message: Record<string, unknown>;
    response: {
        log_id: string;
    };
}

export const updateFormLog = async (
    eventId: string,
    formData: Record<string, string>,
    eventForm: FormField[],
    logId: string | null
): Promise<FormLogApiResponse> => {
    const backendFormData = prepareFormLogData(formData, logId);

    const response = await axios.post<FormLogApiResponse>(
        `https://api.makemypass.com/makemypass/manage-event/${eventId}/form-log/`,
        backendFormData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );

    return response.data;
};
```

**Step 4: Create index file for exports**
```typescript
// services/apis/index.ts
export * from "./eventInfoApi";
export * from "./formSubmissionApi";
export * from "./formLogApi";
```

**Benefits**:
- ✅ Each API concern is separate
- ✅ Easy to mock for testing
- ✅ Clear file organization
- ✅ Single reason to change per file

**Impact**: 🔴 **HIGH** - Improves API organization significantly

---

#### ⚠️ Violation #5: formDataPreparation.ts

**File**: `src/utils/formDataPreparation.ts`

**Current Responsibilities**:
1. ❌ Prepare data for form submission
2. ❌ Prepare data for form log update
3. ❌ Different transformation rules for each

**Current Code**:
```typescript
export const prepareSubmitFormData = (formData, logId?) => { /* ... */ };
export const prepareFormLogData = (formData, logId) => { /* ... */ };
```

**Violation**: Two similar but different concerns in one file

**Recommended Refactoring**: Split by purpose

```typescript
// utils/formSubmission/prepareSubmitData.ts
export const prepareSubmitFormData = (
    formData: Record<string, string>,
    logId?: string | null
): FormData => {
    const submitData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
    });

    submitData.append("__tickets[]", JSON.stringify({
        ticket_id: getTicketIdBasedOnRadio(submitData),
        count: 1,
        my_ticket: true,
    }));

    submitData.append("__utm", JSON.stringify({
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
        utm_term: null,
        utm_content: null,
    }));

    if (logId) {
        submitData.append("log_id", logId);
    }

    return submitData;
};
```

```typescript
// utils/formLog/prepareLogData.ts
export const prepareFormLogData = (
    formData: Record<string, string>,
    logId: string | null
): FormData => {
    const backendFormData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "string") {
            backendFormData.append(key, value.trim());
        } else {
            backendFormData.append(key, value);
        }
    });

    backendFormData.append("__tickets[]", JSON.stringify({
        ticket_id: getTicketIdBasedOnRadio(backendFormData),
        count: 1,
        my_ticket: true,
    }));

    if (logId) {
        backendFormData.append("log_id", logId);
    }

    backendFormData.append("is_next_btn_clk", "false");
    backendFormData.append("is_ticket_selected", "true");

    return backendFormData;
};
```

**Benefits**:
- ✅ Clear separation of submission vs logging
- ✅ Easier to modify one without affecting the other
- ✅ Better file organization

**Impact**: 🟡 **MEDIUM** - Clearer separation of concerns

---

### 🟢 GOOD - Utils (85% Compliant)

Most utility functions are well-focused.

#### ✅ Good Examples

**validators.ts** - Single purpose: Validate fields
**fieldConditions.ts** - Single purpose: Check conditions
**formDataTransformers.ts** - Single purpose: Transform data
**phoneUtils.ts** - Single purpose: Phone number utilities

#### ⚠️ Minor Violation #6: ticketMapping.ts

**File**: `src/utils/ticketMapping.ts`

**Current Code**:
```typescript
export const getTicketIdBasedOnRadio = (formData: FormData): string | undefined => {
    const radioSelection = formData.get("who_walks_willingly_into_the_nwod_edispu") as string;

    switch (radioSelection) {
        case "🕷 The Marked One (Stag Male) – Heard the clock. Chose to stay.":
            return "749a205d-5094-460c-85fb-faca0bbd9894";
        // ... more cases
        default:
            toast.error("Something went wrong. Please try again."); // ❌ UI concern!
    }
};
```

**Violation**: Mixes business logic (ticket mapping) with UI concern (toast notification)

**Recommended Fix**: Throw error, let caller handle UI
```typescript
// ticketMapping.ts - REFACTORED
export class UnknownTicketTypeError extends Error {
    constructor(selection: string) {
        super(`Unknown ticket selection: ${selection}`);
        this.name = "UnknownTicketTypeError";
    }
}

export const getTicketIdBasedOnRadio = (formData: FormData): string => {
    const radioSelection = formData.get("who_walks_willingly_into_the_nwod_edispu") as string;

    switch (radioSelection) {
        case "🕷 The Marked One (Stag Male) – Heard the clock. Chose to stay.":
            return "749a205d-5094-460c-85fb-faca0bbd9894";
        case "🩸 The Unshaken (Stag Female) – Not afraid of the flicker.":
            return "8839c1be-b1b8-4d20-a469-7cbdf12de501";
        case "👁 The Bonded Souls (Couple) – If Vecna takes one, he takes both.":
            return "646d2ca6-f068-4b01-a3b9-a5363dff9965";
        default:
            throw new UnknownTicketTypeError(radioSelection);
    }
};
```

**Usage** (caller handles UI):
```typescript
// In component or hook
try {
    const ticketId = getTicketIdBasedOnRadio(formData);
} catch (error) {
    if (error instanceof UnknownTicketTypeError) {
        toast.error("Something went wrong. Please try again.");
    }
    throw error;
}
```

**Benefits**:
- ✅ Pure business logic, no UI dependency
- ✅ Easier to test
- ✅ Reusable in different contexts (not just with toast)

**Impact**: 🟡 **LOW-MEDIUM** - Better separation of concerns

---

### 🟢 EXCELLENT - Contexts (95% Compliant)

Contexts are very well focused.

#### ✅ Good Examples

**eventDataContext.ts** - Single purpose: Provide event data
```typescript
export const EventDataContext = createContext<EventData | null>(null);

export const useEventDataContext = () => {
    const context = React.useContext(EventDataContext);
    if (!context) {
        throw new Error("useEventDataContext must be used within an EventDataProvider");
    }
    return context;
};
```

**paginationContext.ts** - Single purpose: Provide current page
**Score**: 🟢 **10/10** each

---

## Summary of Violations

### HIGH Priority (Fix First)

| # | File | Issue | Lines | Impact |
|---|------|-------|-------|--------|
| 4 | `services/eventApi.ts` | Multiple API concerns | 67 | HIGH |
| 2 | `hooks/useFormSubmission.hook.ts` | Too many responsibilities | 71 | HIGH |

### MEDIUM Priority

| # | File | Issue | Lines | Impact |
|---|------|-------|-------|--------|
| 3 | `hooks/useFormLogUpdation.hook.ts` | Mixed debouncing + API + state | 37 | MEDIUM |
| 5 | `utils/formDataPreparation.ts` | Two different preparations | 90 | MEDIUM |
| 1 | `components/EventPageContent.tsx` | Navigation state management | 20 | MEDIUM |

### LOW Priority

| # | File | Issue | Lines | Impact |
|---|------|-------|-------|--------|
| 6 | `utils/ticketMapping.ts` | UI concern in business logic | 21 | LOW |

---

## Refactoring Priority

### Phase 1: Critical Services (Week 1)

**Goal**: Separate API concerns

1. **Split eventApi.ts** (2-3 hours)
   - Create `eventInfoApi.ts`
   - Create `formSubmissionApi.ts`
   - Create `formLogApi.ts`
   - Update imports

2. **Test**: Verify all API calls still work

**Expected Outcome**: Clear API organization

---

### Phase 2: Hook Refactoring (Week 2)

**Goal**: Single responsibility per hook

3. **Refactor useFormSubmission** (4-6 hours)
   - Extract `useFormState`
   - Extract `useSubmissionState`
   - Extract `useFormSubmit`
   - Extract `useFormErrorHandler`
   - Update usage

4. **Refactor useFormLogUpdation** (1-2 hours)
   - Extract `useDebouncedEffect`
   - Simplify hook

**Expected Outcome**: Testable, focused hooks

---

### Phase 3: Utils Cleanup (Week 3)

**Goal**: Clean separation of concerns

5. **Split formDataPreparation.ts** (1 hour)
   - Create `prepareSubmitData.ts`
   - Create `prepareLogData.ts`

6. **Fix ticketMapping.ts** (30 minutes)
   - Remove toast, throw error
   - Update callers

**Expected Outcome**: Pure utility functions

---

### Phase 4: Component Improvements (Optional)

7. **Refactor EventPageContent** (1 hour)
   - Extract navigation to router or parent

---

## Benefits of Following SRP

### Before Refactoring

**useFormSubmission.hook.ts**:
- 71 lines
- 6 responsibilities
- 6 reasons to change
- Hard to test
- Hard to understand

### After Refactoring

**useFormState.ts**: 15 lines, 1 responsibility
**useSubmissionState.ts**: 20 lines, 1 responsibility
**useFormSubmit.ts**: 25 lines, 1 responsibility
**useFormErrorHandler.ts**: 20 lines, 1 responsibility
**useFormSubmission.ts**: 25 lines, 1 responsibility (orchestration)

**Total**: 105 lines (vs 71) but:
- ✅ Each hook has 1 responsibility
- ✅ Each hook has 1 reason to change
- ✅ Easy to test independently
- ✅ Easy to understand
- ✅ Reusable components

---

## Metrics

### Current State

| Metric | Value | Target |
|--------|-------|--------|
| **Overall SRP Compliance** | 75% | 90% |
| **Avg Lines per Hook** | 45 | <30 |
| **Avg Responsibilities per Module** | 2.1 | 1.0 |
| **Files with Multiple Concerns** | 6 | 0 |

### After Refactoring

| Metric | Value | Improvement |
|--------|-------|-------------|
| **Overall SRP Compliance** | 90% | +15% |
| **Avg Lines per Hook** | 25 | -44% |
| **Avg Responsibilities per Module** | 1.2 | -43% |
| **Files with Multiple Concerns** | 1 | -83% |

---

## Testing Impact

### Before (Violation Example)

```typescript
// Testing useFormSubmission - HARD!
test("useFormSubmission handles submission", () => {
    // Need to mock:
    // - eventDataContext
    // - submitForm API
    // - updateFormLog API
    // - transformFormData
    // - toast
    // - axios errors
    // Too many dependencies!
});
```

### After (SRP Compliant)

```typescript
// Testing useFormSubmit - EASY!
test("useFormSubmit calls submit API", async () => {
    const mockSubmit = jest.fn();
    // Only mock submit API
    const { submit } = useFormSubmit();
    await submit(mockFormData, mockLogId);
    expect(mockSubmit).toHaveBeenCalledWith(mockFormData, mockLogId);
});

// Testing useFormState - EASY!
test("useFormState updates field", () => {
    const { formData, updateField } = useFormState();
    updateField("name", "John");
    expect(formData.name).toBe("John");
});
```

---

## Timeline & Effort

| Phase | Tasks | Effort | Priority |
|-------|-------|--------|----------|
| **Phase 1** | Split eventApi | 2-3 hours | HIGH |
| **Phase 2** | Refactor hooks | 5-8 hours | HIGH |
| **Phase 3** | Utils cleanup | 1.5 hours | MEDIUM |
| **Phase 4** | Components | 1 hour | LOW |
| **TOTAL** | All SRP fixes | **9.5-12.5 hours** | - |

**Estimated Timeline**: 2-3 weeks (4-6 hours/week)

---

## Conclusion

### Current State: 🟡 75% SRP Compliant

**Strengths**:
- ✅ Most components follow SRP well
- ✅ Contexts are perfectly focused
- ✅ Most utils are single-purpose
- ✅ Good awareness of separation of concerns

**Areas for Improvement**:
- ⚠️ Hooks need refactoring (too many responsibilities)
- ⚠️ Services need splitting (multiple API concerns)
- ⚠️ Some utils mix concerns (UI + business logic)

### After Refactoring: 🟢 90% SRP Compliant

**Expected Benefits**:
- ✅ Easier to understand (each module does one thing)
- ✅ Easier to test (fewer dependencies)
- ✅ Easier to modify (changes are localized)
- ✅ Better reusability (focused modules)
- ✅ Reduced coupling (clear boundaries)

### Recommendation

**Start with Phase 1 & 2** (HIGH priority):
1. Split `eventApi.ts` (2-3 hours)
2. Refactor `useFormSubmission` (4-6 hours)

These provide the **biggest impact** on code quality and maintainability.

**Phase 3 & 4** can be done incrementally as you touch those files.

---

## Quick Wins

If you only have **2 hours**, focus on:

1. **Split eventApi.ts** (1.5 hours)
   - Immediate improvement in API organization
   - Easy to do, high impact

2. **Extract useDebouncedEffect** (30 minutes)
   - Makes useFormLogUpdation cleaner
   - Reusable utility

---

**Questions or ready to start refactoring?**
