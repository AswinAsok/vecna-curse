import { describe, expect, it } from "vitest";

import { instagramTransformer } from "./socialMediaTransformer";

describe("socialMediaTransformer", () => {
    describe("instagramTransformer", () => {
        it("should transform username to full Instagram URL", () => {
            const formData = {
                __vecna_sees_your_instagram_id: "johndoe",
                partner_instagram_id: "janedoe",
            };

            const result = instagramTransformer(formData);

            expect(result.__vecna_sees_your_instagram_id).toBe("https://www.instagram.com/johndoe");
            expect(result.partner_instagram_id).toBe("https://www.instagram.com/janedoe");
        });

        it("should remove @ symbol from username", () => {
            const formData = {
                __vecna_sees_your_instagram_id: "@johndoe",
            };

            const result = instagramTransformer(formData);

            expect(result.__vecna_sees_your_instagram_id).toBe("https://www.instagram.com/johndoe");
        });

        it("should handle empty and whitespace values", () => {
            const formData = {
                __vecna_sees_your_instagram_id: "",
                partner_instagram_id: "   ",
            };

            const result = instagramTransformer(formData);

            expect(result.__vecna_sees_your_instagram_id).toBe("");
            expect(result.partner_instagram_id).toBe("   ");
        });

        it("should not transform existing full URLs", () => {
            const formData = {
                __vecna_sees_your_instagram_id: "https://www.instagram.com/johndoe",
                partner_instagram_id: "http://example.com/profile",
            };

            const result = instagramTransformer(formData);

            expect(result.__vecna_sees_your_instagram_id).toBe("https://www.instagram.com/johndoe");
            expect(result.partner_instagram_id).toBe("http://example.com/profile");
        });

        it("should clean existing Instagram URLs and rebuild them", () => {
            const formData = {
                __vecna_sees_your_instagram_id: "https://www.instagram.com/johndoe",
                partner_instagram_id: "http://instagram.com/janedoe",
            };

            const result = instagramTransformer(formData);

            expect(result.__vecna_sees_your_instagram_id).toBe("https://www.instagram.com/johndoe");
            expect(result.partner_instagram_id).toBe("http://instagram.com/janedoe");
        });

        it("should preserve other form fields unchanged", () => {
            const formData = {
                __vecna_sees_your_instagram_id: "johndoe",
                name: "John Doe",
                email: "john@example.com",
            };

            const result = instagramTransformer(formData);

            expect(result.__vecna_sees_your_instagram_id).toBe("https://www.instagram.com/johndoe");
            expect(result.name).toBe("John Doe");
            expect(result.email).toBe("john@example.com");
        });

        it("should trim whitespace from usernames", () => {
            const formData = {
                __vecna_sees_your_instagram_id: "  johndoe  ",
            };

            const result = instagramTransformer(formData);

            expect(result.__vecna_sees_your_instagram_id).toBe("https://www.instagram.com/johndoe");
        });

        it("should handle complex Instagram URLs with cleanup pattern", () => {
            const formData = {
                __vecna_sees_your_instagram_id: "https://www.instagram.com/johndoe/",
            };

            const result = instagramTransformer(formData);

            expect(result.__vecna_sees_your_instagram_id).toBe(
                "https://www.instagram.com/johndoe/"
            );
        });
    });
});
