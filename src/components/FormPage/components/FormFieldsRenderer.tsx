import type { FormField } from "../../../services/types";
import CheckboxField from "./CheckboxField";
import PhoneField from "./PhoneField";
import RadioField from "./RadioField";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";
import TextField from "./TextField";

const FormFieldsRenderer = ({
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
    switch (field.type) {
        case "text":
        case "email":
        case "number":
        case "url":
            return (
                <TextField
                    key={field.id}
                    field={field}
                    value={value}
                    handleInputChange={handleInputChange}
                    errors={errors}
                />
            );

        case "phone":
            return (
                <PhoneField
                    key={field.id}
                    field={field}
                    value={value}
                    handleInputChange={handleInputChange}
                    errors={errors}
                />
            );

        case "radio":
            return (
                <RadioField
                    key={field.id}
                    field={field}
                    value={value}
                    handleInputChange={handleInputChange}
                    errors={errors}
                />
            );

        case "checkbox":
            return (
                <CheckboxField
                    key={field.id}
                    field={field}
                    value={value}
                    handleInputChange={handleInputChange}
                    errors={errors}
                />
            );

        case "textarea":
            return (
                <TextAreaField
                    key={field.id}
                    field={field}
                    value={value}
                    handleInputChange={handleInputChange}
                    errors={errors}
                />
            );

        case "select":
        case "dropdown":
            return (
                <SelectField
                    key={field.id}
                    field={field}
                    value={value}
                    handleInputChange={handleInputChange}
                    errors={errors}
                />
            );

        default:
            return null;
    }
};

export default FormFieldsRenderer;
