import { useQuery } from "@tanstack/react-query";
import { fetchEventInfo } from "../services/eventApi";

export const useEvent = () => {
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
