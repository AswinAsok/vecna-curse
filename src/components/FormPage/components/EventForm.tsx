import { useEventDataContext } from "../../../contexts/eventDataContext";
import styles from "../FormPage.module.css";
import { useFormSubmission } from "../hooks/useFormSubmission.hook";
import { useFormValidation } from "../hooks/useFormValidatoin.hook";
import { usePagination } from "../hooks/usePagination.hook";
import { checkFieldConditions, extractCountryCode } from "../services/function";
import FormFieldsRenderer from "./FormFieldsRenderer";

const EventForm = ({ logId }: { logId: string | null }) => {
    const eventData = useEventDataContext();

    const { setFormData, formData, isSubmitting, handleSubmit } = useFormSubmission({ logId });

    const { currentPage, totalPages, currentFields } = usePagination();

    const { validateCurrentPage } = useFormValidation({ currentFields, formData });

    const handleInputChange = (fieldKey: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [fieldKey]: value,
        }));
    };

    return (
        <form
            onSubmit={(event) => {
                if (validateCurrentPage()) handleSubmit(event);
            }}
            className={styles.form}
        >
            <div className={styles.fieldsContainer}>
                {currentFields
                    .filter((field) => {
                        // Check standard field conditions
                        if (!checkFieldConditions(field, formData, eventData.form)) {
                            return false;
                        }

                        // Special condition for email field - only show if phone code is not +91
                        if (field.field_key === "email") {
                            const phoneFields = eventData.form.filter((f) => f.type === "phone");
                            // Check if any phone field has a country code that's not +91
                            const hasNonIndianPhone = phoneFields.some((phoneField) => {
                                const code = extractCountryCode(formData[phoneField.field_key]);
                                return code !== "+91";
                            });
                            return hasNonIndianPhone;
                        }

                        return true;
                    })
                    .map((field) => (
                        <FormFieldsRenderer
                            key={field.id}
                            field={field}
                            value={formData[field.field_key] || ""}
                            handleInputChange={handleInputChange}
                        />
                    ))}
            </div>

            {currentPage === totalPages && (
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? "Stepping In..." : "Step Into the Lair →"}
                </button>
            )}
        </form>
    );
};

export default EventForm;
