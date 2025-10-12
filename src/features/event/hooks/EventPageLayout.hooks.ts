import { useQuery } from "@tanstack/react-query";
import { fetchEventInfo } from "../api/eventInfoApi";

export const useFetchEventInfo = () => {
    const {
        data: eventData,
        error,
        isLoading: loading,
    } = useQuery({
        queryKey: ["eventData"],
        queryFn: () => fetchEventInfo(),
    });

    return { eventData, error, loading };
};
