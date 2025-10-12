import type { FormField } from "../../../../types/form.types";
import styles from "../../FormPage.module.css";
import BaseFieldWrapper from "../BaseFieldWrapper";

const RadioField = ({
    field,
    value,
    handleInputChange,
}: {
    field: FormField;
    value: string;
    handleInputChange: (key: string, value: string) => void;
}) => {
    return (
        <BaseFieldWrapper
            id={field.id}
            title={field.title}
            required={field.required}
            description={field.description}
        >
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
        </BaseFieldWrapper>
    );
};

export default RadioField;
