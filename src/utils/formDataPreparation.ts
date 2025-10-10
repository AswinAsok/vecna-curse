import { getTicketIdBasedOnRadio } from "./ticketMapping";

/**
 * Prepares FormData for form submission
 * Adds form fields, tickets, and UTM data
 */
export const prepareSubmitFormData = (
    formData: Record<string, string>,
    logId?: string | null
): FormData => {
    const submitData = new FormData();

    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
    });

    // Add tickets
    submitData.append(
        "__tickets[]",
        JSON.stringify({
            ticket_id: getTicketIdBasedOnRadio(submitData),
            count: 1,
            my_ticket: true,
        })
    );

    // Add UTM data
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

    return submitData;
};

/**
 * Prepares FormData for form log update
 * Adds form fields, tickets, metadata flags, and log ID
 */
export const prepareFormLogData = (
    formData: Record<string, string>,
    logId: string | null
): FormData => {
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

    return backendFormData;
};
