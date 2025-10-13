import { apiClient } from "../../../lib/axios";
import type { EventData } from "../types/event.types";

export const fetchEventInfo = async (eventName: string = "vecnas-curse"): Promise<EventData> => {
    const response = await apiClient.get(`/makemypass/public-form/${eventName}/info/`);
    return response.data.response;
};
