import { useEventDataContext } from "../contexts/eventDataContext";
import { updateFormLog } from "../api";

import { useDebouncedEffect } from "./useDebouncedEffect";

export const useFormLogUpdation = ({
    formData,
    logId,
    setLogId,
}: {
    formData: Record<string, string>;
    logId: string | null;
    setLogId: (id: string) => void;
}) => {
    const eventData = useEventDataContext();

    const updateLog = async () => {
        if (!eventData.id || !eventData.tickets?.length) return;

        try {
            const response = await updateFormLog(eventData.id, formData, logId);

            if (!logId && response.response.log_id) {
                setLogId(response.response.log_id);
            }
        } catch (error) {
            console.log("Error in updatating form log", error);
        }
    };

    useDebouncedEffect(updateLog, [formData, eventData.id, eventData.tickets, logId], 1500);
};
