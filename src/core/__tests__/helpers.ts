import type { FormField } from "@/types/form.types";

export const mockFormField = (): FormField => {
    return {
        id: "1",
        type: "text",
        title: "Name",
        required: true,
        field_key: "name",
        hidden: false,
        unique: null,
        options: [],
        page_num: 1,
        property: {},
        conditions: {},
        team_field: false,
        description: null,
        placeholder: "Enter Name",
    };
};
