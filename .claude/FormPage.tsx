import { useState } from "react";
import styles from "./FormPage.module.css";
import SuccessPage from "../SuccessPage/SuccessPage";

import { useFormLogUpdation } from "./hooks/useFormLogUpdation.hook";
import { useFormSubmission } from "./hooks/useFormSubmission.hook";
import FormPaginationLayout from "./components/FormPaginationLayout";
import EventForm from "./components/EventForm";

const FormPage = () => {
    const [logId, setLogId] = useState<string | null>(null);

    const { formData, isFormSubmitted, submitResponse } = useFormSubmission({ logId });

    useFormLogUpdation({
        formData,
        logId,
        setLogId,
    });

    if (isFormSubmitted && submitResponse) {
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
