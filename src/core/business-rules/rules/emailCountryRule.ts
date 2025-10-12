import { extractCountryCode } from "../../../utils/phoneUtils";
import type { RuleFunction } from "./rulesRegistry";

export const emailRequiredForNonIndianPhone: RuleFunction = (context) => {
    const phoneFields = context.allFormFields.filter((f) => f.type === "phone");

    const hasNonIndianPhone = phoneFields.some((phoneField) => {
        const code = extractCountryCode(context.formData[phoneField.field_key]);
        return code !== "+91";
    });

    return hasNonIndianPhone;
};
