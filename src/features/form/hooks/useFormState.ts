import { useState } from "react";

export const useFormState = () => {
    const [formData, setFormData] = useState<Record<string, string>>({});

    const updateField = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const resetForm = () => setFormData({});

    return { formData, setFormData, updateField, resetForm };
};
