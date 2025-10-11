import CheckboxField from "./CheckboxField";
import { fieldRegistry } from "./fieldRegistry";
import PhoneField from "./PhoneField";
import RadioField from "./RadioField";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";
import TextField from "./TextField";

export const registerDefaultFields = (): void => {
    fieldRegistry.registerMultiple(["text", "email", "number", "url"], TextField);

    fieldRegistry.register("phone", PhoneField);
    fieldRegistry.register("radio", RadioField);
    fieldRegistry.register("checkbox", CheckboxField);
    fieldRegistry.register("textArea", TextAreaField);

    fieldRegistry.registerMultiple(["select", "dropdown"], SelectField);
};
