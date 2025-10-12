/**
 * Transforms Instagram IDs to full profile links
 * @param formData - Form data object
 * @returns Transformed form data with Instagram profile links
 */

import { transformerRegistry } from "../../../core/transformers";

export const transformFormData = (formData: Record<string, string>): Record<string, string> => {
    return transformerRegistry.transform(formData);
};
