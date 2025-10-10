import styles from "../FormPage.module.css";
import Select from "react-select";
import countryCodes from "../data/phoneCountryCodes.json";
import { extractCountryCode } from "../services/function";
import { selectStyles } from "../data/selectStyles";
import type { FormField } from "../../../services/types";
import { useEffect } from "react";

const PhoneField = ({
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
    useEffect(() => {
        if (!value || !value.startsWith("+")) {
            handleInputChange(field.field_key, "+91");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentCountryCode = extractCountryCode(value);
    const countryCodeOptions = countryCodes.map((country) => ({
        value: country.dial_code,
        label: `${country.dial_code} ${country.code}`,
    }));
    const selectedOption = countryCodeOptions.find((option) => option.value === currentCountryCode);

    const handleCountryCodeChange = (key: string, code: string) => {
        const phoneNumber = returnPhoneWithoutCountryCode(value);
        handleInputChange(key, code + phoneNumber);
    };

    const handlePhoneNumberChange = (phoneNumber: string) => {
        const countryCode = currentCountryCode || "+91";
        handleInputChange(field.field_key, countryCode + phoneNumber);
    };

    const returnPhoneWithoutCountryCode = (value: string) => {
        if (value.startsWith("+")) {
            const countryCode = extractCountryCode(value);

            return value.slice(countryCode.length);
        }

        return value;
    };

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
                    value={returnPhoneWithoutCountryCode(value)}
                    onChange={(e) => handlePhoneNumberChange(e.target.value)}
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
