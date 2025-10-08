import { useState } from "react";
import About from "../About/About";
import Form from "../Form/Form";
import { Button } from "../ui/Button/Button";

const EventPageContent = () => {
    const [showForm, setShowForm] = useState(false);
    return (
        <>
            {!showForm ? (
                <About onNext={() => setShowForm(true)} />
            ) : (
                <Form onBack={() => setShowForm(false)} />
            )}

            <Button onClick={() => setShowForm(!showForm)}>
                {showForm ? "← Back to About" : "Next →"}
            </Button>
        </>
    );
};

export default EventPageContent;
