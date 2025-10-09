import { useEffect } from "react";
import { useEventDataContext } from "../../contexts/eventDataContext";
import { updateFormLog } from "../../services/formLogUpdation";

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
    // Debounced form data tracking
    useEffect(() => {
        const handler = setTimeout(() => {
            if (
                (eventData.id || Object.keys(formData).length >= 0) &&
                eventData.tickets.length > 0
            ) {
                updateFormLog(eventData.id, formData, eventData.form, logId)
                    .then((response) => {
                        if (!logId && response.response.log_id) {
                            setLogId(response.response.log_id);
                        }
                    })
                    .catch((error) => {
                        console.error("Error updating form log:", error);
                    });
            }
        }, 1500);

        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData, eventData.id, eventData.form, eventData.tickets, logId]);
};
