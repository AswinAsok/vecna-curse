import { useEffect, useState } from "react";
import { registerDefaultBusinessRules } from "../../utils/businessRules/registerDeafultRules";
import { registerDefaultOperators } from "../../utils/operators/registerDefaultOperators";
import { registerDefaultTransformers } from "../../utils/transfomers/registerDefaultTransformers";
import { registerDefaultValidators } from "../../utils/validation/registerDeafultValidators";
import { registerDefaultFields } from "../FormPage/components/registerDefaultFields";

import EventPageLayout from "./components/EventPageLayout";
import About from "../About/About";
import { Button } from "../ui/Button/Button";
import FormPage from "../FormPage/FormPage";

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
