import countryCodes from "../components/FormPage/data/phoneCountryCodes.json";

/**
 * Extracts the country code from a phone number string
 * @param value - Phone number with country code (e.g., "+919876543210")
 * @returns The country code (e.g., "+91") or default "+91"
 */
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

/**
 * Removes the country code from a phone number
 * @param value - Phone number with country code (e.g., "+919876543210")
 * @returns Phone number without country code (e.g., "9876543210")
 */
export const removeCountryCode = (value: string): string => {
    if (value.startsWith("+")) {
        const countryCode = extractCountryCode(value);
        return value.slice(countryCode.length);
    }

    return value;
};

/**
 * Combines country code with phone number
 * @param countryCode - Country code (e.g., "+91")
 * @param phoneNumber - Phone number without country code
 * @returns Complete phone number with country code
 */
export const combinePhoneNumber = (countryCode: string, phoneNumber: string): string => {
    return countryCode + phoneNumber;
};
