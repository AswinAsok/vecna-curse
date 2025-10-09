import { useState } from "react";
import Select from "react-select";
import { type SubmitFormResponse, submitForm } from "../../services/eventApi";
import styles from "./Form.module.css";
import countryCodes from "./phoneCountryCodes.json";
import SuccessPage from "../SuccessPage/SuccessPage";
import { useEventDataContext } from "../../contexts/eventDataContext";
import { checkFieldConditions, getPhoneNumberWithoutCode } from "./function";
import toast from "react-hot-toast";
import { usePagination } from "./usePagination.hook";
import type { FormField } from "../../services/types";
import { useFormLogUpdation } from "./useFormLogUpdation.hook";
import { updateFormLog } from "../../services/formLogUpdation";

const Form = () => {
    const eventData = useEventDataContext();

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [phoneCountryCode, setPhoneCountryCode] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [submitResponse, setSubmitResponse] = useState<SubmitFormResponse | null>(null);
    const [logId, setLogId] = useState<string | null>(null);

    useFormLogUpdation({
        formData,
        logId,
        setLogId,
    });

    const { currentPage, totalPages, currentFields, handleNext, handleBack, justNavigatedRef } =
        usePagination();

    // Group form fields by page_num
    const handleInputChange = (fieldKey: string, value: string) => {
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
                    const code = phoneCountryCode[phoneField.field_key] || "+91";
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

            const response = await submitForm(eventData.id, transformedFormData, logId);
            setSubmitResponse(response.response);
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

    const handlePhoneChange = (fieldKey: string, phoneNumber: string) => {
        const countryCode = phoneCountryCode[fieldKey] || "+91";
        setFormData((prev) => ({
            ...prev,
            [fieldKey]: `${countryCode}${phoneNumber}`,
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

    const handleCountryCodeChange = (fieldKey: string, code: string) => {
        setPhoneCountryCode((prev) => ({
            ...prev,
            [fieldKey]: code,
        }));
        const phoneNumber = getPhoneNumberWithoutCode(
            formData[fieldKey] || "",
            phoneCountryCode[fieldKey] || "+91"
        );
        setFormData((prev) => ({
            ...prev,
            [fieldKey]: `${code}${phoneNumber}`,
        }));
    };

    const renderField = (field: FormField) => {
        const value = formData[field.field_key] || "";

        switch (field.type) {
            case "text":
            case "email":
            case "number":
            case "url":
                return (
                    <div key={field.id} className={styles.fieldContainer}>
                        <label className={styles.label}>
                            {field.title}
                            {field.required && <span className={styles.required}>*</span>}
                        </label>
                        {field.description && (
                            <p className={styles.description}>{field.description}</p>
                        )}
                        <input
                            type={field.type === "url" ? "text" : field.type}
                            value={value}
                            onChange={(e) => handleInputChange(field.field_key, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            className={styles.input}
                        />
                        {errors[field.field_key] && (
                            <p className={styles.error}>{errors[field.field_key]}</p>
                        )}
                    </div>
                );

            case "phone": {
                const currentCountryCode = phoneCountryCode[field.field_key] || "+91";
                const phoneNumber = getPhoneNumberWithoutCode(value, currentCountryCode);
                const countryCodeOptions = countryCodes.map((country) => ({
                    value: country.dial_code,
                    label: `${country.dial_code} ${country.code}`,
                }));
                const selectedOption = countryCodeOptions.find(
                    (option) => option.value === currentCountryCode
                );

                return (
                    <div key={field.id} className={styles.fieldContainer}>
                        <label className={styles.label}>
                            {field.title}
                            {field.required && <span className={styles.required}>*</span>}
                        </label>
                        {field.description && (
                            <p className={styles.description}>{field.description}</p>
                        )}
                        <div className={styles.phoneInputContainer}>
                            <Select
                                value={selectedOption}
                                onChange={(option) =>
                                    option && handleCountryCodeChange(field.field_key, option.value)
                                }
                                options={countryCodeOptions}
                                className={styles.countryCodeSelect}
                                classNamePrefix="select"
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                                        borderColor: state.isFocused
                                            ? "#ede0d4"
                                            : "rgba(255, 255, 255, 0.2)",
                                        borderRadius: "0.375rem",
                                        padding: "0.125rem",
                                        color: "white",
                                        minWidth: "140px",
                                        fontSize: "1rem",
                                        boxShadow: "none",
                                        "&:hover": {
                                            borderColor: state.isFocused
                                                ? "#ede0d4"
                                                : "rgba(255, 255, 255, 0.2)",
                                        },
                                    }),
                                    valueContainer: (base) => ({
                                        ...base,
                                        padding: "0.125rem 0.5rem",
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: "white",
                                    }),
                                    input: (base) => ({
                                        ...base,
                                        color: "white",
                                    }),
                                    indicatorSeparator: () => ({
                                        display: "none",
                                    }),
                                    dropdownIndicator: (base) => ({
                                        ...base,
                                        color: "rgba(255, 255, 255, 0.5)",
                                        "&:hover": {
                                            color: "rgba(255, 255, 255, 0.7)",
                                        },
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        backgroundColor: "#1a1a1a",
                                        border: "1px solid rgba(255, 255, 255, 0.2)",
                                        borderRadius: "0.375rem",
                                    }),
                                    menuList: (base) => ({
                                        ...base,
                                        padding: "0.25rem",
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isFocused
                                            ? "rgba(139, 68, 68, 0.3)"
                                            : state.isSelected
                                            ? "rgba(139, 68, 68, 0.5)"
                                            : "transparent",
                                        color: "white",
                                        padding: "0.5rem 0.75rem",
                                        borderRadius: "0.25rem",
                                        cursor: "pointer",
                                        "&:active": {
                                            backgroundColor: "rgba(139, 68, 68, 0.5)",
                                        },
                                    }),
                                }}
                            />
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => handlePhoneChange(field.field_key, e.target.value)}
                                placeholder={field.placeholder}
                                required={field.required}
                                className={styles.phoneInput}
                            />
                        </div>
                        {errors[field.field_key] && (
                            <p className={styles.error}>{errors[field.field_key]}</p>
                        )}
                    </div>
                );
            }

            case "radio":
                return (
                    <div key={field.id} className={styles.fieldContainer}>
                        <label className={styles.label}>
                            {field.title}
                            {field.required && <span className={styles.required}>*</span>}
                        </label>
                        {field.description && (
                            <p className={styles.description}>{field.description}</p>
                        )}
                        <div className={styles.radioGroup}>
                            {field.options[0]?.values.map((option, index) => (
                                <label key={index} className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name={field.field_key}
                                        value={option}
                                        checked={value === option}
                                        onChange={(e) =>
                                            handleInputChange(field.field_key, e.target.value)
                                        }
                                        required={field.required}
                                        className={styles.radio}
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                        {errors[field.field_key] && (
                            <p className={styles.error}>{errors[field.field_key]}</p>
                        )}
                    </div>
                );

            case "checkbox":
                return (
                    <div key={field.id} className={styles.fieldContainer}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={value === "true"}
                                onChange={(e) =>
                                    handleInputChange(field.field_key, e.target.checked.toString())
                                }
                                required={field.required}
                                className={styles.checkbox}
                            />
                            <span>
                                {field.title}
                                {field.required && <span className={styles.required}>*</span>}
                            </span>
                        </label>
                        {field.description && (
                            <p className={styles.description}>{field.description}</p>
                        )}
                        {errors[field.field_key] && (
                            <p className={styles.error}>{errors[field.field_key]}</p>
                        )}
                    </div>
                );

            case "textarea":
                return (
                    <div key={field.id} className={styles.fieldContainer}>
                        <label className={styles.label}>
                            {field.title}
                            {field.required && <span className={styles.required}>*</span>}
                        </label>
                        {field.description && (
                            <p className={styles.description}>{field.description}</p>
                        )}
                        <textarea
                            value={value}
                            onChange={(e) => handleInputChange(field.field_key, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            className={styles.textarea}
                        />
                        {errors[field.field_key] && (
                            <p className={styles.error}>{errors[field.field_key]}</p>
                        )}
                    </div>
                );

            case "select":
            case "dropdown":
                return (
                    <div key={field.id} className={styles.fieldContainer}>
                        <label className={styles.label}>
                            {field.title}
                            {field.required && <span className={styles.required}>*</span>}
                        </label>
                        {field.description && (
                            <p className={styles.description}>{field.description}</p>
                        )}
                        <select
                            value={value}
                            onChange={(e) => handleInputChange(field.field_key, e.target.value)}
                            required={field.required}
                            className={styles.select}
                        >
                            <option value="">Select an option</option>
                            {field.options[0]?.values.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors[field.field_key] && (
                            <p className={styles.error}>{errors[field.field_key]}</p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    if (eventData.form.length === 0) {
        return null;
    }

    // Show success page after form submission
    if (isFormSubmitted && submitResponse) {
        return <SuccessPage />;
    }

    return (
        <div className={styles.formContainer}>
            {currentPage > 1 && (
                <p className={styles.backLink} onClick={handleBack}>
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
                                    const code = phoneCountryCode[phoneField.field_key] || "+91";
                                    return code !== "+91";
                                });
                                return hasNonIndianPhone;
                            }

                            return true;
                        })
                        .map((field) => renderField(field))}
                </div>

                {currentPage === totalPages && (
                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
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

export default Form;
