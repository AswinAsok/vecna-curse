import { useState } from "react";

import type { SubmitFormResponse } from "../api";

export const useSubmissionState = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitResponse, setSubmitResponse] = useState<SubmitFormResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    return {
        isSubmitting,
        setIsSubmitting,
        isSubmitted,
        setIsSubmitted,
        submitResponse,
        setSubmitResponse,
        error,
        setError,
    };
};
