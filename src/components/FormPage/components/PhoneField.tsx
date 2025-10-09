import styles from "../FormPage.module.css";
import Select from "react-select";
import countryCodes from "../data/phoneCountryCodes.json";
import { getPhoneNumberWithoutCode } from "../services/function";
import { selectStyles } from "../data/selectStyles";
import type { FormField } from "../../../services/types";

const PhoneField = ({
    field,
    value,
    handlePhoneChange,
    phoneCountryCode,
    handleCountryCodeChange,
    errors,
}: {
    field: FormField;
    value: string;
    handlePhoneChange: (key: string, value: string) => void;
    phoneCountryCode: Record<string, string>;
    handleCountryCodeChange: (key: string, code: string) => void;
    errors: Record<string, string>;
}) => {
    const currentCountryCode = phoneCountryCode[field.field_key] || "+91";
    const phoneNumber = getPhoneNumberWithoutCode(value, currentCountryCode);
    const countryCodeOptions = countryCodes.map((country) => ({
        value: country.dial_code,
        label: `${country.dial_code} ${country.code}`,
    }));
    const selectedOption = countryCodeOptions.find((option) => option.value === currentCountryCode);

    return (
        <div key={field.id} className={styles.fieldContainer}>
            <label className={styles.label}>
                {field.title}
                {field.required && <span className={styles.required}>*</span>}
            </label>
            {field.description && <p className={styles.description}>{field.description}</p>}
            <div className={styles.phoneInputContainer}>
                <Select
                    value={selectedOption}
                    onChange={(option) =>
                        option && handleCountryCodeChange(field.field_key, option.value)
                    }
                    options={countryCodeOptions}
                    className={styles.countryCodeSelect}
                    classNamePrefix="select"
                    styles={selectStyles}
                />
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(field.field_key, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className={styles.phoneInput}
                />
            </div>
            {errors[field.field_key] && <p className={styles.error}>{errors[field.field_key]}</p>}
        </div>
    );
};

export default PhoneField;
