export interface FormField {
    id: string;
    type: string;
    title: string;
    hidden: boolean;
    unique: boolean | null;
    options: Array<{
        values: string[];
        conditions: Record<string, unknown>;
    }>;
    page_num: number;
    property: Record<string, unknown>;
    required: boolean;
    field_key: string;
    conditions: Record<string, unknown>;
    team_field: boolean;
    description: string | null;
    placeholder: string;
    admin_field?: boolean;
}
