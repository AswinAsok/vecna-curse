import { useState } from "react";
import Form from "../../Form/Form";
import About from "../../About/About";
import { Button } from "../../ui/Button/Button";

const EventPageContent = () => {
    const [showForm, setShowForm] = useState(false);

    return showForm ? (
        <Form />
    ) : (
        <>
            <About />
            <Button onClick={() => setShowForm(true)}>Next →</Button>
        </>
    );
};

export default EventPageContent;
