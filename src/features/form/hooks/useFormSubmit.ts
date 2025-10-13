import { submitForm, type SubmitFormResponse,updateFormLog } from "../api";
import { useEventDataContext } from "../contexts/eventDataContext";
import { transformFormData } from "../utils";

export const useFormSubmit = () => {
    const eventData = useEventDataContext();

    const submit = async (
        formData: Record<string, string>,
        logId: string | null | undefined
    ): Promise<SubmitFormResponse> => {
        //Pre-Submission: Update Form Log
        if (eventData.id && eventData.tickets?.length > 0 && logId) {
            await updateFormLog(eventData.id, formData, logId);
        }

        const transformedData = transformFormData(formData);

        const response = await submitForm(eventData.id, transformedData, logId);

        return response.response;
    };

    return { submit };
};
