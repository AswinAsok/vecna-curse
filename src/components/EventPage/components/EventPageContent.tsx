import { useState } from "react";
import FormPage from "../../FormPage/FormPage";
import About from "../../About/About";
import { Button } from "../../ui/Button/Button";

const EventPageContent = () => {
    const [showForm, setShowForm] = useState(false);

    return showForm ? (
        <FormPage />
    ) : (
        <>
            <About />
            <Button onClick={() => setShowForm(true)}>Next →</Button>
        </>
    );
};

export default EventPageContent;
