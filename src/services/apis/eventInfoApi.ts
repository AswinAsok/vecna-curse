// services/apis/eventInfoApi.ts
import axios from "axios";
import type { EventData } from "../../types/event.types";

const API_BASE_URL = "https://api.makemypass.com/makemypass/public-form";

export const fetchEventInfo = async (eventName: string = "vecnas-curse"): Promise<EventData> => {
    const response = await axios.get(`${API_BASE_URL}/${eventName}/info/`);
    return response.data.response;
};
