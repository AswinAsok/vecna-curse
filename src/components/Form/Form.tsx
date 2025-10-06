import { useState, useMemo } from "react";
import { type FormField } from "../../services/eventApi";
import styles from "./Form.module.css";

interface FormProps {
    formFields: FormField[];
    onBack?: () => void;
}

const Form = ({ formFields, onBack }: FormProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState<Record<string, string>>({});

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
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        // Add your form submission logic here
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

    const renderField = (field: FormField) => {
        const value = formData[field.field_key] || "";

        switch (field.type) {
            case "text":
            case "email":
            case "number":
            case "phone":
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
                            type={field.type === "phone" ? "tel" : field.type}
                            value={value}
                            onChange={(e) => handleInputChange(field.field_key, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            className={styles.input}
                        />
                    </div>
                );

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
                    </div>
                );

            default:
                return null;
        }
    };

    if (formFields.length === 0) {
        return null;
    }

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.pageIndicator}>
                    Page {currentPage} of {totalPages}
                </div>

                <div className={styles.fieldsContainer}>
                    {currentFields
                        .filter((field) => checkFieldConditions(field))
                        .map((field) => renderField(field))}
                </div>

                <div className={styles.navigationButtons}>
                    {currentPage > 1 ? (
                        <button
                            type="button"
                            onClick={handlePrevious}
                            className={styles.previousButton}
                        >
                            Previous
                        </button>
                    ) : onBack ? (
                        <button
                            type="button"
                            onClick={onBack}
                            className={styles.backButton}
                        >
                            ← Back to About
                        </button>
                    ) : null}

                    {currentPage < totalPages ? (
                        <button type="button" onClick={handleNext} className={styles.nextButton}>
                            Next
                        </button>
                    ) : (
                        <button type="submit" className={styles.submitButton}>
                            Submit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Form;
