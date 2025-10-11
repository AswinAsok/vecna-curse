import type { TransformerFunction } from "./transformerRegistry";

const createSocialMediaTransformer = (
    fieldKeys: string[],
    baseUrl: string,
    cleanupPattern?: RegExp
): TransformerFunction => {
    return (formData) => {
        const transformed = { ...formData };

        fieldKeys.forEach((fieldKey) => {
            const value = transformed[fieldKey];

            if (!value || value.trim() === "") {
                return;
            }

            let cleanId = value.trim();

            // Remove @ symbol
            cleanId = cleanId.replace(/^@/, "");

            // Remove existing profile URLs
            if (cleanupPattern) {
                cleanId = cleanId.replace(cleanupPattern, "");
            }

            // Only transform if not already a full URL
            if (!cleanId.startsWith("http")) {
                transformed[fieldKey] = `${baseUrl}${cleanId}`;
            }
        });

        return transformed;
    };
};

// Instagram transformer
export const instagramTransformer = createSocialMediaTransformer(
    ["__vecna_sees_your_instagram_id", "partner_instagram_id"],
    "https://www.instagram.com/",
    /^https?:\/\/(www\.)?instagram\.com\//i
);
