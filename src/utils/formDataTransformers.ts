/**
 * Transforms Instagram IDs to full profile links
 * @param formData - Form data object
 * @returns Transformed form data with Instagram profile links
 */
export const transformInstagramFields = (
    formData: Record<string, string>
): Record<string, string> => {
    // Instagram field keys that need to be converted to profile links
    const instagramFieldKeys = ["__vecna_sees_your_instagram_id", "partner_instagram_id"];

    const transformedFormData = { ...formData };

    instagramFieldKeys.forEach((fieldKey) => {
        if (transformedFormData[fieldKey] && transformedFormData[fieldKey].trim() !== "") {
            const instagramId = transformedFormData[fieldKey].trim();
            // Remove @ if user included it and any instagram.com links if already present
            let cleanId = instagramId.replace(/^@/, "");
            cleanId = cleanId.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "");
            // Convert to full Instagram profile link
            transformedFormData[fieldKey] = `https://www.instagram.com/${cleanId}`;
        }
    });

    return transformedFormData;
};

/**
 * Trims all string values in form data
 * @param formData - Form data object
 * @returns Form data with trimmed string values
 */
export const trimFormData = (formData: Record<string, string>): Record<string, string> => {
    const trimmedData: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "string") {
            trimmedData[key] = value.trim();
        } else {
            trimmedData[key] = value;
        }
    });

    return trimmedData;
};
