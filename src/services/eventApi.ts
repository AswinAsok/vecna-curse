import axios from 'axios';

const API_BASE_URL = 'https://api.makemypass.com/makemypass/public-form';

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

export interface EventData {
    id: string;
    name: string;
    title: string;
    description: string;
    reg_start_date: string | null;
    event_start_date: string;
    event_end_date: string;
    logo: string | null;
    banner: string;
    location: {
        lat: number;
        lng: number;
    };
    place: string;
    timezone: string;
    socials: {
        twitter: string | null;
        facebook: string | null;
        linkedin: string | null;
        telegram: string | null;
        whatsapp: string | null;
        instagram: string | null;
    };
    hosts: Array<{
        id: string;
        title: string;
        name: string;
        role: string;
        profile_pic: string | null;
        is_private: boolean;
        is_org: boolean;
    }>;
    verification_settings: Record<string, unknown>;
    speakers: unknown[];
    sponsors: unknown[];
    is_child_event: boolean;
    type_of_event: string;
    is_team_event: boolean;
    team_settings: Record<string, unknown>;
    include_gst: boolean;
    has_schedule: boolean;
    total_participants: number;
    claim_ticket_id: string | null;
    claim_code_message: string | null;
    form: FormField[];
    tickets: unknown[];
    script_injection: unknown[];
    has_scratch_card: boolean;
    paid_perks: unknown[];
    coupon: {
        status: boolean;
    };
    is_online: boolean;
    close_form: boolean;
    is_private: boolean;
    is_checkout: boolean;
    parse_audio: boolean;
    is_sub_event: boolean;
    map_new_code: boolean;
    print_ticket: boolean;
    remote_print: string | null;
    resubmission: boolean;
    is_random_user: boolean;
    edit_submission: boolean;
    is_scratch_card: boolean;
    edit_ticket_code: boolean;
    approval_required: boolean;
    is_grouped_ticket: boolean;
    is_public_insight: boolean;
    show_ticket_first: boolean;
    edit_mail_template: boolean;
    thank_you_new_page: boolean;
    select_multi_ticket: boolean;
    add_custom_mail_alias: string | null;
    disable_delete_ticket_cron: boolean;
    required_field_invite_guest: boolean;
    checkin_confirmation_required: boolean;
    show_associate_users_on_checkin: boolean;
}

export interface EventApiResponse {
    hasError: boolean;
    statusCode: number;
    message: Record<string, unknown>;
    response: EventData;
}

export const fetchEventInfo = async (eventName: string = 'vecnas-curse'): Promise<EventData> => {
    try {
        const response = await axios.get<EventApiResponse>(`${API_BASE_URL}/${eventName}/info/`);
        return response.data.response;
    } catch (error) {
        console.error('Error fetching event info:', error);
        throw error;
    }
};
