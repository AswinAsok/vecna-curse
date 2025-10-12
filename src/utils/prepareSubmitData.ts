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
