import countryCodes from "@/features/form/data/phoneCountryCodes.json";

export const extractCountryCode = (value: string): string => {
    if (value) {
        const currentCountryCodes = countryCodes.map((country) => country.dial_code);

        const extractedCode = currentCountryCodes.find((code) => {
            return value.startsWith(code);
        });

        return extractedCode || "+91";
    }

    return "+91";
};

export const removeCountryCode = (value: string): string => {
    if (value.startsWith("+")) {
        const countryCode = extractCountryCode(value);
        return value.slice(countryCode.length);
    }

    return value;
};

export const combinePhoneNumber = (countryCode: string, phoneNumber: string): string => {
    return countryCode + phoneNumber;
};
