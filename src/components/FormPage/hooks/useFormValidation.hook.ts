import { useEventDataContext } from "../../../contexts/eventDataContext";
import type { FormField } from "../../../services/types";
import { checkFieldConditions } from "../../../utils/fieldConditions";
import { validateField } from "../../../utils/validation/validators";
import { businessRuleRegistry } from "../../../utils/businessRules/rulesRegistry";

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

        // setErrors(newErrors);
        return isValid;
    };

    return { validateCurrentPage };
};
