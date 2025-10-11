import { useState } from "react";
import { submitForm, type SubmitFormResponse } from "../../../services/eventApi";
import { useEventDataContext } from "../../../contexts/eventDataContext";
import { updateFormLog } from "../../../services/formLogUpdation";
import { transformFormData } from "../../../utils/formDataTransformers";
import toast from "react-hot-toast";

export const useFormSubmission = ({ logId }: { logId?: string | null }) => {
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
            if (eventData.id && eventData.tickets && eventData.tickets.length > 0 && logId) {
                await updateFormLog(eventData.id, formData, eventData.form, logId).catch(
                    (error) => {
                        console.error("Error updating form log before submit:", error);
                        // Continue with submission even if log update fails
                    }
                );
            }

            // Transform Instagram IDs to full profile links
            const transformedFormData = transformFormData(formData);

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
