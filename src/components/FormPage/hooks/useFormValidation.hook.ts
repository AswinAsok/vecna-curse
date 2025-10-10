import { useEventDataContext } from "../../../contexts/eventDataContext";
import type { FormField } from "../../../services/types";
import { checkFieldConditions } from "../../../utils/fieldConditions";
import { shouldValidateEmailField } from "../../../utils/businessRules";
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

            // Special condition for email field - only validate if phone code is not +91
            if (field.field_key === "email") {
                return shouldValidateEmailField(eventData.form, formData);
            }

            return true;
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
