import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { registerDefaultBusinessRules } from "@/core/business-rules";
import { registerDefaultOperators } from "@/core/operators";
import { registerDefaultTransformers } from "@/core/transformers";
import { registerDefaultValidators } from "@/core/validators";
import { FormPage, registerDefaultFields } from "@/features/form";

import About from "./components/About/About";
import EventPageLayout from "./layouts/EventPageLayout";

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
