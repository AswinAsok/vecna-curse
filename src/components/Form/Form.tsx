import { useState, useMemo } from "react";
import Select from "react-select";
import { type FormField, type SubmitFormResponse, submitForm } from "../../services/eventApi";
import styles from "./Form.module.css";
import countryCodes from "./phoneCountryCodes.json";
import SuccessModal from "../SuccessModal/SuccessModal";

interface FormProps {
    formFields: FormField[];
    eventId: string;
    eventTitle: string;
    ticketId: string;
    onBack?: () => void;
}

const Form = ({ formFields, eventId, eventTitle, ticketId, onBack }: FormProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [phoneCountryCode, setPhoneCountryCode] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [submitResponse, setSubmitResponse] = useState<SubmitFormResponse | null>(null);

    // Group form fields by page_num
    const pageGroups = useMemo(() => {
        const groups: Record<number, FormField[]> = {};
        formFields.forEach((field) => {
            if (!field.hidden) {
                if (!groups[field.page_num]) {
                    groups[field.page_num] = [];
                }
                groups[field.page_num].push(field);
            }
        });
        return groups;
    }, [formFields]);

    const totalPages = Object.keys(pageGroups).length;
    const currentFields = pageGroups[currentPage] || [];

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
        const fieldsToValidate = currentFields.filter((field) => checkFieldConditions(field));
        const newErrors: Record<string, string> = {};
        let isValid = true;

        for (const field of fieldsToValidate) {
            if (field.required) {
                const value = formData[field.field_key];
                if (!value || value.trim() === "") {
                    newErrors[field.field_key] = "This field is required";
                    isValid = false;
                }
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (!validateCurrentPage()) {
            return;
        }
        if (currentPage < totalPages) {
            setErrors({});
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setErrors({});
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateCurrentPage()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await submitForm(eventId, formData, ticketId);
            setSubmitResponse(response.response);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Form submission failed:", error);
            alert("Failed to submit form. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        // Clear form data
        setFormData({});
        setPhoneCountryCode({});
        setErrors({});
        // Reset to first page
        setCurrentPage(1);
    };

    // Check if field conditions are met
    const checkFieldConditions = (field: FormField): boolean => {
        if (!field.conditions || Object.keys(field.conditions).length === 0) {
            return true;
        }

        const { field: fieldId, value: conditionValue, operator } = field.conditions as {
            field?: string;
            value?: string;
            operator?: string;
        };

        if (!fieldId || !conditionValue) {
            return true;
        }

        // Find the referenced field to get its field_key
        const referencedField = formFields.find((f) => f.id === fieldId);
        if (!referencedField) {
            return true;
        }

        const currentValue = formData[referencedField.field_key];

        switch (operator) {
            case "=":
                return currentValue === conditionValue;
            case "!=":
                return currentValue !== conditionValue;
            default:
                return true;
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
        const phoneNumber = getPhoneNumberWithoutCode(formData[fieldKey] || "", phoneCountryCode[fieldKey] || "+91");
        setFormData((prev) => ({
            ...prev,
            [fieldKey]: `${code}${phoneNumber}`,
        }));
    };

    const getPhoneNumberWithoutCode = (fullPhone: string, currentCode: string) => {
        if (fullPhone.startsWith(currentCode)) {
            return fullPhone.slice(currentCode.length);
        }
        return fullPhone;
    };

    const renderField = (field: FormField) => {
        const value = formData[field.field_key] || "";

        switch (field.type) {
            case "text":
            case "email":
            case "number":
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
                            type={field.type}
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

    if (formFields.length === 0) {
        return null;
    }

    const handleBack = () => {
        setErrors({});
        if (currentPage > 1) {
            handlePrevious();
        } else if (onBack) {
            onBack();
        }
    };

    return (
        <div className={styles.formContainer}>
            {(currentPage > 1 || onBack) && (
                <p className={styles.backLink} onClick={handleBack}>
                    ← Back
                </p>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.fieldsContainer}>
                    {currentFields
                        .filter((field) => checkFieldConditions(field))
                        .map((field) => renderField(field))}
                </div>

                <div className={styles.navigationButtons}>
                    {currentPage < totalPages ? (
                        <button type="button" onClick={handleNext} className={styles.nextButton}>
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    )}
                    <span className={styles.pageIndicator}>
                        Page {currentPage} of {totalPages}
                    </span>
                </div>
            </form>
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleModalClose}
                followupMsg={submitResponse?.followup_msg || ""}
                eventRegisterId={submitResponse?.event_register_id || ""}
                eventTitle={eventTitle}
            />
        </div>
    );
};

export default Form;
