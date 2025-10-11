import type { FormField } from "../../../services/types";
import { fieldRegistry } from "./fieldRegistry";
import { registerDefaultFields } from "./registerDefaultFields";

const FormFieldsRenderer = ({
    field,
    value,
    handleInputChange,
}: {
    field: FormField;
    value: string;
    handleInputChange: (key: string, value: string) => void;
}) => {
    registerDefaultFields();
    const FieldComponent = fieldRegistry.get(field.field_key);

    if (!FieldComponent) {
        return null;
    }

    return (
        <FieldComponent
            key={field.id}
            field={field}
            value={value}
            handleInputChange={handleInputChange}
        />
    );
};

export default FormFieldsRenderer;
