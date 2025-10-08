import { useState } from "react";
import About from "../../About/About";
import Form from "../../Form/Form";

const EventPageContent = () => {
    const [showForm, setShowForm] = useState(false);
    return (
        <>
            {!showForm ? (
                <About onNext={() => setShowForm(true)} />
            ) : (
                <Form onBack={() => setShowForm(false)} />
            )}
        </>
    );
};

export default EventPageContent;
