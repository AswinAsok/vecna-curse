import { useState } from "react";
import About from "../About/About";
import Form from "../Form/Form";
import { Button } from "../ui/Button/Button";

const EventPageContent = () => {
    const [showForm, setShowForm] = useState(false);

    if (showForm) {
        return <Form />;
    } else {
        return (
            <>
                <About />
                <Button onClick={() => setShowForm(true)}>Next →</Button>
            </>
        );
    }
};

export default EventPageContent;
