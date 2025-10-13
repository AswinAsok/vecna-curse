import { useState } from "react";

import { SuccessPage } from "../success";
import EventForm from "./components/EventForm";
import FormPaginationLayout from "./components/FormPaginationLayout";
import styles from "./FormPage.module.css";
import { useFormLogUpdation } from "./hooks/useFormLogUpdation.hook";
import { useFormSubmission } from "./hooks/useFormSubmission.hook";
import { useSubmissionState } from "./hooks/useSubmissionState";

const FormPage = () => {
    const [logId, setLogId] = useState<string | null>(null);

    const { formData, submitResponse } = useFormSubmission({ logId });

    const { isSubmitted } = useSubmissionState();

    useFormLogUpdation({
        formData,
        logId,
        setLogId,
    });

    if (isSubmitted && submitResponse) {
        return <SuccessPage />;
    }

    return (
        <div className={styles.formContainer}>
            <FormPaginationLayout>
                <EventForm logId={logId} />
            </FormPaginationLayout>
        </div>
    );
};

export default FormPage;
