import { useState } from "react";
import Form from "../../Form/Form";
import About from "../../About/About";
import { Button } from "../../ui/Button/Button";
import { useEventDataContext } from "../../../contexts/eventDataContext";
import styles from "./EventPageContent.module.css";

const EventPageContent = () => {
    const [showForm, setShowForm] = useState(false);
    const eventData = useEventDataContext();

    return showForm ? (
        <Form />
    ) : (
        <>
            <About />
            {eventData.err_message ? (
                <div 
                    className={styles.errorMessage}
                    dangerouslySetInnerHTML={{ __html: eventData.err_message }}
                />
            ) : (
                <Button onClick={() => setShowForm(true)}>Next →</Button>
            )}
        </>
    );
};

export default EventPageContent;
