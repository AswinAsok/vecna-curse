import toast from "react-hot-toast";

/**
 * Maps radio selection to corresponding ticket ID
 * Business-specific logic for the Vecna's Curse event
 */
export const getTicketIdBasedOnRadio = (formData: FormData): string | undefined => {
    const radioSelection = formData.get("who_walks_willingly_into_the_nwod_edispu") as string;

    switch (radioSelection) {
        case "🕷 The Marked One (Stag Male) – Heard the clock. Chose to stay.":
            return "749a205d-5094-460c-85fb-faca0bbd9894";
        case "🩸 The Unshaken (Stag Female) – Not afraid of the flicker.":
            return "8839c1be-b1b8-4d20-a469-7cbdf12de501";
        case "👁 The Bonded Souls (Couple) – If Vecna takes one, he takes both.":
            return "646d2ca6-f068-4b01-a3b9-a5363dff9965";
        default:
            toast.error("Something went wrong. Please try again.");
    }
};
