import type { FormField } from "../../../services/types";
import styles from "../FormPage.module.css";

const SelectField = ({
    field,
    value,
    handleInputChange,
}: {
    field: FormField;
    value: string;
    handleInputChange: (key: string, value: string) => void;
}) => {
    return (
        <div key={field.id} className={styles.fieldContainer}>
            <label className={styles.label}>
                {field.title}
                {field.required && <span className={styles.required}>*</span>}
            </label>
            {field.description && <p className={styles.description}>{field.description}</p>}
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
            {/* {errors[field.field_key] && <p className={styles.error}>{errors[field.field_key]}</p>} */}
        </div>
    );
};

export default SelectField;
