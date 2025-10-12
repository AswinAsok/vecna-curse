import { useEffect, useState } from "react";

import EventPageLayout from "./layouts/EventPageLayout";
import { Button } from "../../components/ui/Button/Button";
import { FormPage } from "../form";
import About from "./components/About/About";
import { registerDefaultFields } from "../form";
import { registerDefaultValidators } from "../../core/validators";
import { registerDefaultOperators } from "../../core/operators";
import { registerDefaultTransformers } from "../../core/transformers";
import { registerDefaultBusinessRules } from "../../core/business-rules";

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
