import { beforeEach, describe, expect, it, vi } from "vitest";

import { prepareFormLogData } from "./prepareLogData";
import { getTicketIdBasedOnRadio } from "./ticketMapping";

// Mock the ticketMapping module
vi.mock("./ticketMapping", () => ({
    getTicketIdBasedOnRadio: vi.fn(),
}));

describe("prepareFormLogData", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getTicketIdBasedOnRadio).mockReturnValue("ticket-123");
    });

    it("should create FormData with basic form fields", () => {
        const formData = { name: "John", email: "john@example.com" };
        const result = prepareFormLogData(formData);

        expect(result.get("name")).toBe("John");
        expect(result.get("email")).toBe("john@example.com");
    });

    it("should trim string values in form data", () => {
        const formData = { name: "  John  ", email: "  john@example.com  " };
        const result = prepareFormLogData(formData);

        expect(result.get("name")).toBe("John");
        expect(result.get("email")).toBe("john@example.com");
    });

    it("should add ticket information with correct structure", () => {
        const formData = { name: "John" };
        const result = prepareFormLogData(formData);

        const ticketsData = result.get("__tickets[]") as string;
        const parsedTickets = JSON.parse(ticketsData);

        expect(parsedTickets).toEqual({
            ticket_id: "ticket-123",
            count: 1,
            my_ticket: true,
        });
    });

    it("should call getTicketIdBasedOnRadio with FormData", () => {
        const formData = { name: "John" };
        prepareFormLogData(formData);

        expect(getTicketIdBasedOnRadio).toHaveBeenCalledWith(expect.any(FormData));
    });

    it("should add log_id when provided", () => {
        const formData = { name: "John" };
        const logId = "log-456";
        const result = prepareFormLogData(formData, logId);

        expect(result.get("log_id")).toBe("log-456");
    });

    it("should not add log_id when not provided", () => {
        const formData = { name: "John" };
        const result = prepareFormLogData(formData);

        expect(result.get("log_id")).toBeNull();
    });

    it("should not add log_id when null is provided", () => {
        const formData = { name: "John" };
        const result = prepareFormLogData(formData, null);

        expect(result.get("log_id")).toBeNull();
    });

    it("should add required metadata flags", () => {
        const formData = { name: "John" };
        const result = prepareFormLogData(formData);

        expect(result.get("is_next_btn_clk")).toBe("false");
        expect(result.get("is_ticket_selected")).toBe("true");
    });

    it("should handle empty form data", () => {
        const formData = {};
        const result = prepareFormLogData(formData);

        expect(result.get("__tickets[]")).toBeTruthy();
        expect(result.get("is_next_btn_clk")).toBe("false");
        expect(result.get("is_ticket_selected")).toBe("true");
    });
});
