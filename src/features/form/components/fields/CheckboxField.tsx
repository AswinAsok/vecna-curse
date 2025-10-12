import type { FormField } from "../../../../types/form.types";
import styles from "../../FormPage.module.css";

const CheckboxField = ({
    field,
    value,
    handleInputChange,
}: {
    field: FormField;
    value: string;
    handleInputChange: (fieldKey: string, value: string) => void;
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
        </div>
    );
};

export default CheckboxField;
