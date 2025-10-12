import { useFormErrorHandler } from "./useFormErrorHandler";
import { useFormState } from "./useFormState";
import { useFormSubmit } from "./useFormSubmit";
import { useSubmissionState } from "./useSubmissionState";

export const useFormSubmission = ({ logId }: { logId?: string | null }) => {
    const { formData, setFormData, updateField } = useFormState();

    const {
        isSubmitting,
        setIsSubmitting,
        isSubmitted,
        setIsSubmitted,
        submitResponse,
        setSubmitResponse,
        error,
        setError,
    } = useSubmissionState();

    const { submit } = useFormSubmit();

    const { handleError } = useFormErrorHandler();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await submit(formData, logId);
            setSubmitResponse(response);
            setIsSubmitted(true);
        } catch (error) {
            const errorMessage = handleError(error);
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        setFormData,
        updateField,
        isSubmitting,
        isSubmitted,
        submitResponse,
        error,
        handleSubmit,
    };
};
