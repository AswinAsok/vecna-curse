import { useState } from "react";
import styles from "./FormPage.module.css";
import SuccessPage from "../SuccessPage/SuccessPage";
import { useEventDataContext } from "../../contexts/eventDataContext";
import { checkFieldConditions, extractCountryCode } from "./services/function";

import { useFormLogUpdation } from "./hooks/useFormLogUpdation.hook";
import { usePagination } from "./hooks/usePagination.hook";
import FormFieldsRenderer from "./components/FormFieldsRenderer";
import { useFormSubmission } from "./hooks/useFormSubmission.hook";
import { useFormValidation } from "./hooks/useFormValidatoin.hook";

const FormPage = () => {
    const [logId, setLogId] = useState<string | null>(null);

    const { currentPage, totalPages, currentFields, handleNext, handlePrevious, justNavigatedRef } =
        usePagination();
    const eventData = useEventDataContext();
    const { formData, setFormData, isSubmitting, isFormSubmitted, submitResponse, handleSubmit } =
        useFormSubmission({ logId });
    const { validateCurrentPage } = useFormValidation({ currentFields, formData });

    useFormLogUpdation({
        formData,
        logId,
        setLogId,
    });

    const handleInputChange = (fieldKey: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [fieldKey]: value,
        }));
    };

    if (isFormSubmitted && submitResponse) {
        return <SuccessPage />;
    }

    return (
        <div className={styles.formContainer}>
            {currentPage > 1 && (
                <p className={styles.backLink} onClick={handlePrevious}>
                    ← Back
                </p>
            )}
            <form
                onSubmit={(event) => {
                    if (!justNavigatedRef.current && validateCurrentPage()) handleSubmit(event);
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
                                const phoneFields = eventData.form.filter(
                                    (f) => f.type === "phone"
                                );
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
            {currentPage < totalPages && (
                <button
                    type="button"
                    onClick={() => {
                        if (!validateCurrentPage()) {
                            return;
                        }
                        handleNext();
                    }}
                    className={styles.nextButton}
                >
                    Next
                </button>
            )}
        </div>
    );
};

export default FormPage;
