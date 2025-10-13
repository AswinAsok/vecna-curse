import axios from "axios";

import { prepareSubmitFormData } from "../utils";

const API_BASE_URL = "https://api.makemypass.com/makemypass/public-form";

export interface SubmitFormResponse {
    followup_msg: string;
    approval_status: string;
    event_register_id: string;
    redirection: Record<string, unknown>;
    extra_tickets: unknown[];
    thank_you_new_page: boolean;
    is_online: boolean;
    type_of_event: string;
    has_invoice: boolean;
}

interface SubmitApiResponse {
    hasError: boolean;
    statusCode: number;
    message: Record<string, unknown>;
    response: SubmitFormResponse;
}

export const submitForm = async (
    eventId: string,
    formData: Record<string, string>,
    logId?: string | null
): Promise<SubmitApiResponse> => {
    const submitData = prepareSubmitFormData(formData, logId);

    const response = await axios.post<SubmitApiResponse>(
        `${API_BASE_URL}/${eventId}/submit/`,
        submitData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );

    return response.data;
};
