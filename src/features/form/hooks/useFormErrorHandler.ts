import toast from "react-hot-toast";

export const useFormErrorHandler = () => {
    const handleError = (error: unknown): string | null => {
        const axiosError = error as {
            response?: { data?: { message?: Record<string, string> } };
        };

        const errorMessage = axiosError.response?.data?.message;

        if (errorMessage && typeof errorMessage === "object") {
            // Extract first error from each field
            const errors = Object.values(errorMessage)
                .flat()
                .filter((msg) => typeof msg === "string");

            console.log(errors);

            if (errors.length > 0) {
                toast.error(errors[0]);
                return errors[0];
            }
        }

        toast.error("Failed to submit the form, Please try again.");
        return "Failed to submit the form. Please try again.";
    };

    return { handleError };
};
