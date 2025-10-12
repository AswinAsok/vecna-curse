import axios from "axios";
import { prepareFormLogData } from "../../utils/prepareSubmitData";
export interface FormLogApiResponse {
    hasError: boolean;
    statusCode: number;
    message: Record<string, unknown>;
    response: {
        log_id: string;
    };
}

export const updateFormLog = async (
    eventId: string,
    formData: Record<string, string>,
    logId: string | null
): Promise<FormLogApiResponse> => {
    const backendFormData = prepareFormLogData(formData, logId);

    const response = await axios.post<FormLogApiResponse>(
        `https://api.makemypass.com/makemypass/manage-event/${eventId}/form-log/`,
        backendFormData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );

    return response.data;
};
