import { describe, expect, it } from "vitest";

import { getTicketIdBasedOnRadio } from "./ticketMapping";

describe("getTicketIdBasedOnRadio", () => {
    it("should return correct ticket ID for The Marked One (Stag Male)", () => {
        const formData = new FormData();
        formData.set(
            "who_walks_willingly_into_the_nwod_edispu",
            "🕷 The Marked One (Stag Male) – Heard the clock. Chose to stay."
        );

        const result = getTicketIdBasedOnRadio(formData);

        expect(result).toBe("749a205d-5094-460c-85fb-faca0bbd9894");
    });

    it("should return correct ticket ID for The Unshaken (Stag Female)", () => {
        const formData = new FormData();
        formData.set(
            "who_walks_willingly_into_the_nwod_edispu",
            "🩸 The Unshaken (Stag Female) – Not afraid of the flicker."
        );

        const result = getTicketIdBasedOnRadio(formData);

        expect(result).toBe("8839c1be-b1b8-4d20-a469-7cbdf12de501");
    });

    it("should return correct ticket ID for The Bonded Souls (Couple)", () => {
        const formData = new FormData();
        formData.set(
            "who_walks_willingly_into_the_nwod_edispu",
            "👁 The Bonded Souls (Couple) – If Vecna takes one, he takes both."
        );

        const result = getTicketIdBasedOnRadio(formData);

        expect(result).toBe("646d2ca6-f068-4b01-a3b9-a5363dff9965");
    });

    it("should return undefined for unknown radio selection", () => {
        const formData = new FormData();
        formData.set("who_walks_willingly_into_the_nwod_edispu", "Unknown option");

        const result = getTicketIdBasedOnRadio(formData);

        expect(result).toBeUndefined();
    });

    it("should return undefined when radio field is not set", () => {
        const formData = new FormData();

        const result = getTicketIdBasedOnRadio(formData);

        expect(result).toBeUndefined();
    });

    it("should return undefined when radio field is null", () => {
        const formData = new FormData();
        formData.set("who_walks_willingly_into_the_nwod_edispu", "");

        const result = getTicketIdBasedOnRadio(formData);

        expect(result).toBeUndefined();
    });
});
