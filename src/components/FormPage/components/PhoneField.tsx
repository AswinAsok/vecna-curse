import styles from "../FormPage.module.css";
import Select from "react-select";
import countryCodes from "../data/phoneCountryCodes.json";
import {
    extractCountryCode,
    removeCountryCode,
    combinePhoneNumber,
} from "../../../utils/phoneUtils";
import { selectStyles } from "../data/selectStyles";
import { useEffect } from "react";
import BaseFieldWrapper from "./BaseFieldWrapper";
import type { FormField } from "../../../types/form.types";

const PhoneField = ({
    field,
    value,
    handleInputChange,
}: {
    field: FormField;
    value: string;
    handleInputChange: (key: string, value: string) => void;
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
        const phoneNumber = removeCountryCode(value);
        handleInputChange(key, combinePhoneNumber(code, phoneNumber));
    };

    const handlePhoneNumberChange = (phoneNumber: string) => {
        const countryCode = currentCountryCode || "+91";
        handleInputChange(field.field_key, combinePhoneNumber(countryCode, phoneNumber));
    };

    return (
        <BaseFieldWrapper
            id={field.id}
            title={field.title}
            required={field.required}
            description={field.description}
        >
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
                    value={removeCountryCode(value)}
                    onChange={(e) => handlePhoneNumberChange(e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className={styles.phoneInput}
                />
            </div>
        </BaseFieldWrapper>
    );
};

export default PhoneField;
