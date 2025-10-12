import { useEffect, useState } from "react";
import { registerDefaultBusinessRules } from "../../core/business-rules";
import { registerDefaultOperators } from "../../core/operators";
import { registerDefaultTransformers } from "../../core/transformers";
import { registerDefaultValidators } from "../../core/validators";
import { registerDefaultFields } from "../../components/FormPage/components/registerDefaultFields";

import EventPageLayout from "./layouts/EventPageLayout";
import { Button } from "../../components/ui/Button/Button";
import FormPage from "../../components/FormPage/FormPage";
import About from "./components/About/About";

const EventPage = () => {
    useEffect(() => {
        registerDefaultFields();
        registerDefaultValidators();
        registerDefaultOperators();
        registerDefaultTransformers();
        registerDefaultBusinessRules();
    }, []);

    const [currentStep, setCurrentStep] = useState<"about" | "form">("about");

    return (
        <EventPageLayout>
            {currentStep === "about" && (
                <>
                    <About />
                    <Button onClick={() => setCurrentStep("form")}>Next →</Button>
                </>
            )}
            {currentStep === "form" && <FormPage />}
        </EventPageLayout>
    );
};

export default EventPage;
