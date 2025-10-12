import { getTicketIdBasedOnRadio } from "./ticketMapping";

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
