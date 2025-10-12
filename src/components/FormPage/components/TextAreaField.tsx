import type { FormField } from "../../../types/form.types";
import styles from "../FormPage.module.css";
import BaseFieldWrapper from "./BaseFieldWrapper";

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
        <BaseFieldWrapper
            id={field.id}
            title={field.title}
            required={field.required}
            description={field.description}
        >
            <textarea
                value={value}
                onChange={(e) => handleInputChange(field.field_key, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className={styles.textarea}
            />
        </BaseFieldWrapper>
    );
};

export default TextAreaField;
