import axios from "axios";
import { prepareFormLogData } from "../utils/formDataPreparation";
import type { FormLogApiResponse } from "./eventApi";
import type { FormField } from "./types";

export const updateFormLog = async (
    eventId: string,
    formData: Record<string, string>,
    _eventForm: FormField[],
    logId: string | null
): Promise<FormLogApiResponse> => {
    try {
        const backendFormData = prepareFormLogData(formData, logId);

        const response = await axios.post<FormLogApiResponse>(
            `https://api.makemypass.com/makemypass/manage-event/${eventId}/form-log/`,
            backendFormData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error updating form log:", error);
        throw error;
    }
};
