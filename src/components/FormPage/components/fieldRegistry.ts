import type { FormField } from "../../../services/types";
import CheckboxField from "./CheckboxField";
import PhoneField from "./PhoneField";
import RadioField from "./RadioField";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";
import TextField from "./TextField";

export type FieldComponent = (props: {
    field: FormField;
    value: string;
    handleInputChange: (key: string, value: string) => void;
}) => React.ReactElement | null;

export const fieldRegistry: Record<string, FieldComponent> = {
    text: TextField,
    email: TextField,
    number: TextField,
    url: TextField,
    phone: PhoneField,
    radio: RadioField,
    checkbox: CheckboxField,
    textarea: TextAreaField,
    select: SelectField,
    dropdown: SelectField,
};
