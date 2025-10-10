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
}: {
    field: FormField;
    value: string;
    handleInputChange: (key: string, value: string) => void;
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
                />
            );

        case "phone":
            return (
                <PhoneField
                    key={field.id}
                    field={field}
                    value={value}
                    handleInputChange={handleInputChange}
                />
            );

        case "radio":
            return (
                <RadioField
                    key={field.id}
                    field={field}
                    value={value}
                    handleInputChange={handleInputChange}
                />
            );

        case "checkbox":
            return (
                <CheckboxField
                    key={field.id}
                    field={field}
                    value={value}
                    handleInputChange={handleInputChange}
                />
            );

        case "textarea":
            return (
                <TextAreaField
                    key={field.id}
                    field={field}
                    value={value}
                    handleInputChange={handleInputChange}
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
                />
            );

        default:
            return null;
    }
};

export default FormFieldsRenderer;
