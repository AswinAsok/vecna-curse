import axios from "axios";
import type { EventData, FormField } from "./types";
import { getTicketIdBasedOnRadio } from "../components/Form/function";

const API_BASE_URL = "https://api.makemypass.com/makemypass/public-form";

interface EventApiResponse {
    hasError: boolean;
    statusCode: number;
    message: Record<string, unknown>;
    response: EventData;
}

export const fetchEventInfo = async (eventName: string = "vecnas-curse"): Promise<EventData> => {
    const response = await axios.get<EventApiResponse>(`${API_BASE_URL}/${eventName}/info/`);
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
        const submitData = new FormData();

        // Add all form fields
        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value);
        });

        // Add tickets and utm data
        submitData.append(
            "__tickets[]",
            JSON.stringify({
                ticket_id: getTicketIdBasedOnRadio(submitData),
                count: 1,
                my_ticket: true,
            })
        );
        submitData.append(
            "__utm",
            JSON.stringify({
                utm_source: null,
                utm_medium: null,
                utm_campaign: null,
                utm_term: null,
                utm_content: null,
            })
        );

        // Add log_id if it exists
        if (logId) {
            submitData.append("log_id", logId);
        }

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

export const updateFormLog = async (
    eventId: string,
    formData: Record<string, string>,
    _eventForm: FormField[],
    logId: string | null
): Promise<FormLogApiResponse> => {
    try {
        const backendFormData = new FormData();

        // Process and trim form data
        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === "string") {
                // Trim string values
                const trimmedValue = value.trim();
                backendFormData.append(key, trimmedValue);
            } else {
                backendFormData.append(key, value);
            }
        });

        // Add ticket information
        backendFormData.append(
            "__tickets[]",
            JSON.stringify({
                ticket_id: getTicketIdBasedOnRadio(backendFormData),
                count: 1,
                my_ticket: true,
            })
        );

        // Add log_id if it exists (for updates)
        if (logId) {
            backendFormData.append("log_id", logId);
        }

        // Add metadata flags
        backendFormData.append("is_next_btn_clk", "false");
        backendFormData.append("is_ticket_selected", "true");

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
