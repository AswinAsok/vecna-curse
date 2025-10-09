import axios from "axios";
import { getTicketIdBasedOnRadio } from "../components/FormPage/services/function";
import type { FormLogApiResponse } from "./eventApi";
import type { FormField } from "./types";

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
