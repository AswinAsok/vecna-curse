import { describe, expect, it, vi } from "vitest";

import { prepareSubmitFormData } from "./prepareSubmitData";
import { getTicketIdBasedOnRadio } from "./ticketMapping";

vi.mock("./ticketMapping", () => ({
    getTicketIdBasedOnRadio: vi.fn(),
}));

const mockGetTicketIdBasedOnRadio = vi.mocked(getTicketIdBasedOnRadio);

describe("prepareSubmitFormData", () => {
    it("should add all form fields to FormData", () => {
        const formData = { name: "John", email: "john@example.com" };
        mockGetTicketIdBasedOnRadio.mockReturnValue("ticket-123");

        const result = prepareSubmitFormData(formData);

        expect(result.get("name")).toBe("John");
        expect(result.get("email")).toBe("john@example.com");
    });

    it("should add tickets with correct structure", () => {
        const formData = { name: "John" };
        mockGetTicketIdBasedOnRadio.mockReturnValue("ticket-456");

        const result = prepareSubmitFormData(formData);

        const ticketsData = JSON.parse(result.get("__tickets[]") as string);
        expect(ticketsData).toEqual({
            ticket_id: "ticket-456",
            count: 1,
            my_ticket: true,
        });
    });

    it("should add UTM data with null values", () => {
        const formData = { name: "John" };
        mockGetTicketIdBasedOnRadio.mockReturnValue("ticket-789");

        const result = prepareSubmitFormData(formData);

        const utmData = JSON.parse(result.get("__utm") as string);
        expect(utmData).toEqual({
            utm_source: null,
            utm_medium: null,
            utm_campaign: null,
            utm_term: null,
            utm_content: null,
        });
    });

    it("should add log_id when provided", () => {
        const formData = { name: "John" };
        const logId = "log-123";
        mockGetTicketIdBasedOnRadio.mockReturnValue("ticket-999");

        const result = prepareSubmitFormData(formData, logId);

        expect(result.get("log_id")).toBe("log-123");
    });

    it("should not add log_id when null", () => {
        const formData = { name: "John" };
        mockGetTicketIdBasedOnRadio.mockReturnValue("ticket-999");

        const result = prepareSubmitFormData(formData, null);

        expect(result.get("log_id")).toBeNull();
    });

    it("should not add log_id when undefined", () => {
        const formData = { name: "John" };
        mockGetTicketIdBasedOnRadio.mockReturnValue("ticket-999");

        const result = prepareSubmitFormData(formData);

        expect(result.get("log_id")).toBeNull();
    });

    it("should handle empty form data", () => {
        const formData = {};
        mockGetTicketIdBasedOnRadio.mockReturnValue("ticket-empty");

        const result = prepareSubmitFormData(formData);

        expect(result.get("__tickets[]")).toBeTruthy();
        expect(result.get("__utm")).toBeTruthy();
    });
});
