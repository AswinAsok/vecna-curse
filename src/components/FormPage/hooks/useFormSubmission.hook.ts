import { useState } from "react";
import { submitForm, type SubmitFormResponse } from "../../../services/eventApi";
import { useEventDataContext } from "../../../contexts/eventDataContext";
import { updateFormLog } from "../../../services/formLogUpdation";
import toast from "react-hot-toast";

export const useFormSubmission = ({ logId }: { logId: string | null }) => {
    const eventData = useEventDataContext();

    const [formData, setFormData] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [submitResponse, setSubmitResponse] = useState<SubmitFormResponse | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);
        try {
            // Update form log one final time before submitting
            if (eventData.id && eventData.tickets && eventData.tickets.length > 0) {
                await updateFormLog(eventData.id, formData, eventData.form, logId).catch(
                    (error) => {
                        console.error("Error updating form log before submit:", error);
                        // Continue with submission even if log update fails
                    }
                );
            }

            // Instagram field keys that need to be converted to profile links
            const instagramFieldKeys = ["__vecna_sees_your_instagram_id", "partner_instagram_id"];

            // Transform Instagram IDs to full profile links
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

            const response = await submitForm(eventData.id, transformedFormData, logId);
            setSubmitResponse(response.response);
            setIsFormSubmitted(true);

            // setLogId(null);
        } catch (error: unknown) {
            // Handle field-specific validation errors from axios error response
            const axiosError = error as {
                response?: { data?: { message?: Record<string, string[]> } };
            };
            const errorMessage = axiosError?.response?.data?.message;

            if (errorMessage && typeof errorMessage === "object") {
                const fieldErrors: Record<string, string> = {};
                Object.keys(errorMessage).forEach((fieldKey) => {
                    const errorMessages = errorMessage[fieldKey];
                    if (Array.isArray(errorMessages) && errorMessages.length > 0) {
                        fieldErrors[fieldKey] = errorMessages[0];
                    }
                });
                // setErrors(fieldErrors);
            } else {
                toast.error("Failed to submit the form. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        setFormData,
        formData,
        isSubmitting,
        isFormSubmitted,
        submitResponse,
        handleSubmit,
    };
};
