import axios from "axios";
import type { EventData } from "./types";
import { prepareSubmitFormData } from "../utils/formDataPreparation";

const API_BASE_URL = "https://api.makemypass.com/makemypass/public-form";

export const fetchEventInfo = async (eventName: string = "vecnas-curse"): Promise<EventData> => {
    const response = await axios.get(`${API_BASE_URL}/${eventName}/info/`);
    return response.data.response;
};

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
    console.log(formData);

    try {
        const submitData = prepareSubmitFormData(formData, logId);

        const response = await axios.post<SubmitApiResponse>(
            `${API_BASE_URL}/${eventId}/submit/`,
            submitData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
    }
};

// Form-log API types and functions

export interface FormLogApiResponse {
    hasError: boolean;
    statusCode: number;
    message: Record<string, unknown>;
    response: {
        log_id: string;
    };
}
