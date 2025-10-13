import { useState } from "react";

import SuccessPage from "../SuccessPage/SuccessPage";
import EventForm from "./components/EventForm";
import FormPaginationLayout from "./components/FormPaginationLayout";
import styles from "./FormPage.module.css";
import { useFormLogUpdation } from "./hooks/useFormLogUpdation.hook";
import { useFormSubmission } from "./hooks/useFormSubmission.hook";

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
