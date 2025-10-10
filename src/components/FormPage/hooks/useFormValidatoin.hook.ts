import { useEventDataContext } from "../../../contexts/eventDataContext";
import type { FormField } from "../../../services/types";
import { checkFieldConditions, extractCountryCode } from "../services/function";

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
                const phoneFields = eventData.form.filter((f) => f.type === "phone");
                const hasNonIndianPhone = phoneFields.some((phoneField) => {
                    const code = extractCountryCode(formData[phoneField.field_key]);
                    return code !== "+91";
                });
                return hasNonIndianPhone;
            }

            return true;
        });

        const newErrors: Record<string, string> = {};
        let isValid = true;

        for (const field of fieldsToValidate) {
            const value = formData[field.field_key];

            if (field.required && (!value || value.trim() === "")) {
                newErrors[field.field_key] = "This field is required";
                isValid = false;
            } else if (field.type === "email" && value && value.trim() !== "") {
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value.trim())) {
                    newErrors[field.field_key] = "Please enter a valid email address";
                    isValid = false;
                }
            }
        }

        // setErrors(newErrors);
        return isValid;
    };

    return { validateCurrentPage };
};
