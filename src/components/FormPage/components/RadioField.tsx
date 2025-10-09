import type { FormField } from "../../../services/types";
import styles from "../FormPage.module.css";

const RadioField = ({
    field,
    value,
    handleInputChange,
    errors,
}: {
    field: FormField;
    value: string;
    handleInputChange: (key: string, value: string) => void;
    errors: Record<string, string>;
}) => {
    return (
        <div key={field.id} className={styles.fieldContainer}>
            <label className={styles.label}>
                {field.title}
                {field.required && <span className={styles.required}>*</span>}
            </label>
            {field.description && <p className={styles.description}>{field.description}</p>}
            <div className={styles.radioGroup}>
                {field.options[0]?.values.map((option, index) => (
                    <label key={index} className={styles.radioLabel}>
                        <input
                            type="radio"
                            name={field.field_key}
                            value={option}
                            checked={value === option}
                            onChange={(e) => handleInputChange(field.field_key, e.target.value)}
                            required={field.required}
                            className={styles.radio}
                        />
                        <span>{option}</span>
                    </label>
                ))}
            </div>
            {errors[field.field_key] && <p className={styles.error}>{errors[field.field_key]}</p>}
        </div>
    );
};

export default RadioField;
