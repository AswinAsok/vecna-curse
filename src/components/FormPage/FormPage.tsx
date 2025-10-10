import { useState } from "react";
import { type SubmitFormResponse, submitForm } from "../../services/eventApi";
import styles from "./FormPage.module.css";
import SuccessPage from "../SuccessPage/SuccessPage";
import { useEventDataContext } from "../../contexts/eventDataContext";
import { checkFieldConditions, extractCountryCode } from "./services/function";
import toast from "react-hot-toast";
import { updateFormLog } from "../../services/formLogUpdation";
import { useFormLogUpdation } from "./hooks/useFormLogUpdation.hook";
import { usePagination } from "./hooks/usePagination.hook";
import FormFieldsRenderer from "./components/FormFieldsRenderer";

const FormPage = () => {
    const eventData = useEventDataContext();

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<Record<string, string>>({});

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [submitResponse, setSubmitResponse] = useState<SubmitFormResponse | null>(null);
    const [logId, setLogId] = useState<string | null>(null);

    useFormLogUpdation({
        formData,
        logId,
        setLogId,
    });

    const { currentPage, totalPages, currentFields, handleNext, handlePrevious, justNavigatedRef } =
        usePagination();

    const handleInputChange = (fieldKey: string, value: string) => {
        console.log(fieldKey, value);
        setFormData((prev) => ({
            ...prev,
            [fieldKey]: value,
        }));
        // Clear error when user starts typing
        if (errors[fieldKey]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldKey];
                return newErrors;
            });
        }
    };

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

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent auto-submit immediately after page navigation
        if (justNavigatedRef.current) {
            return;
        }

        if (!validateCurrentPage()) {
            return;
        }

        setIsSubmitting(true);
        try {
            // Update form log one final time before submitting
            if (eventData.id && eventData.tickets && eventData.tickets.length > 0) {
                await updateFormLog(eventData.id, formData, eventData.form, logId).catch(
                    (error) => {
                        console.error("Error updating form log before submit:", error);
                        // Continue with submission even if log update fails
                    }
                );
            }

            // Instagram field keys that need to be converted to profile links
            const instagramFieldKeys = ["__vecna_sees_your_instagram_id", "partner_instagram_id"];

            // Transform Instagram IDs to full profile links
            const transformedFormData = { ...formData };
            instagramFieldKeys.forEach((fieldKey) => {
                if (transformedFormData[fieldKey] && transformedFormData[fieldKey].trim() !== "") {
                    const instagramId = transformedFormData[fieldKey].trim();
                    // Remove @ if user included it and any instagram.com links if already present
                    let cleanId = instagramId.replace(/^@/, "");
                    cleanId = cleanId.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "");
                    // Convert to full Instagram profile link
                    transformedFormData[fieldKey] = `https://www.instagram.com/${cleanId}`;
                }
            });

            console.log(transformedFormData);
            // const response = await submitForm(eventData.id, transformedFormData, logId);
            // setSubmitResponse(response.response);
            setIsFormSubmitted(true);

            setLogId(null);
        } catch (error: unknown) {
            // Handle field-specific validation errors from axios error response
            const axiosError = error as {
                response?: { data?: { message?: Record<string, string[]> } };
            };
            const errorMessage = axiosError?.response?.data?.message;

            if (errorMessage && typeof errorMessage === "object") {
                const fieldErrors: Record<string, string> = {};
                Object.keys(errorMessage).forEach((fieldKey) => {
                    const errorMessages = errorMessage[fieldKey];
                    if (Array.isArray(errorMessages) && errorMessages.length > 0) {
                        fieldErrors[fieldKey] = errorMessages[0];
                    }
                });
                setErrors(fieldErrors);
            } else {
                toast.error("Failed to submit the form. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
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
            <form onSubmit={handleSubmit} className={styles.form}>
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
                                errors={errors}
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
