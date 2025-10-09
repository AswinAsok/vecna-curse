import styles from "../FormPage.module.css";
import type { FormField } from "../../../services/types";

const TextField = ({
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
            <input
                type={field.type === "url" ? "text" : field.type}
                value={value}
                onChange={(e) => handleInputChange(field.field_key, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className={styles.input}
            />
            {errors[field.field_key] && <p className={styles.error}>{errors[field.field_key]}</p>}
        </div>
    );
};

export default TextField;
