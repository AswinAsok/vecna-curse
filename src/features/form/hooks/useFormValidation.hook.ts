import { businessRuleRegistry } from "../../../core/business-rules";
import { validateField } from "../../../core/validators";
import type { FormField } from "../../../types/form.types";
import { checkFieldConditions } from "../utils";

export const useFormValidation = ({
    currentFields,
    formData,
    allFields,
}: {
    currentFields: FormField[];
    formData: Record<string, string>;
    allFields: FormField[];
}) => {
    const validateCurrentPage = (): boolean => {
        const fieldsToValidate = currentFields.filter((field) => {
            // Check standard field conditions

            if (!checkFieldConditions(field, formData, allFields)) {
                return false;
            }

            return businessRuleRegistry.shouldValidate({
                field,
                formData,
                allFormFields: allFields,
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

        // setErrors(newErrors);
        return isValid;
    };

    return { validateCurrentPage };
};
