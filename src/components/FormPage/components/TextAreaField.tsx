import type { FormField } from "../../../services/types";
import styles from "../FormPage.module.css";

const TextAreaField = ({
    field,
    value,
    handleInputChange,
}: {
    field: FormField;
    value: string;
    handleInputChange: (key: string, value: string) => void;
}) => {
    return (
        <>
            <div key={field.id} className={styles.fieldContainer}>
                <label className={styles.label}>
                    {field.title}
                    {field.required && <span className={styles.required}>*</span>}
                </label>
                {field.description && <p className={styles.description}>{field.description}</p>}
                <textarea
                    value={value}
                    onChange={(e) => handleInputChange(field.field_key, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className={styles.textarea}
                />
            </div>
        </>
    );
};

export default TextAreaField;
