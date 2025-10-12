import type { FormField } from "../../../../types/form.types";
import styles from "../../FormPage.module.css";
import BaseFieldWrapper from "../BaseFieldWrapper";

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
        <BaseFieldWrapper
            id={field.id}
            title={field.title}
            required={field.required}
            description={field.description}
        >
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
        </BaseFieldWrapper>
    );
};

export default SelectField;
