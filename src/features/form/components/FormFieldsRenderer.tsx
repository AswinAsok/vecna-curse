import type { FormField } from "../../../types/form.types";
import { fieldRegistry } from "./fieldRegistry";

const FormFieldsRenderer = ({
    field,
    value,
    handleInputChange,
}: {
    field: FormField;
    value: string;
    handleInputChange: (key: string, value: string) => void;
}) => {
    const FieldComponent = fieldRegistry.get(field.type);

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
