import CheckboxField from "./fields/CheckboxField";
import { fieldRegistry } from "./fieldRegistry";
import PhoneField from "./fields/PhoneField";
import RadioField from "./fields/RadioField";
import SelectField from "./fields/SelectField";
import TextAreaField from "./fields/TextAreaField";
import TextField from "./fields/TextField";

export const registerDefaultFields = (): void => {
    fieldRegistry.registerMultiple(["text", "email", "number", "url"], TextField);

    fieldRegistry.register("phone", PhoneField);
    fieldRegistry.register("radio", RadioField);
    fieldRegistry.register("checkbox", CheckboxField);
    fieldRegistry.register("textArea", TextAreaField);

    fieldRegistry.registerMultiple(["select", "dropdown"], SelectField);
};
