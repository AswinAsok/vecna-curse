import type { FormField } from "../../../services/types";
import styles from "../FormPage.module.css";

const CheckboxField = ({
    field,
    value,
    handleInputChange,
    errors,
}: {
    field: FormField;
    value: string;
    handleInputChange: (fieldKey: string, value: string) => void;
    errors: Record<string, string>;
}) => {
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
            {field.description && <p className={styles.description}>{field.description}</p>}
            {errors[field.field_key] && <p className={styles.error}>{errors[field.field_key]}</p>}
        </div>
    );
};

export default CheckboxField;
