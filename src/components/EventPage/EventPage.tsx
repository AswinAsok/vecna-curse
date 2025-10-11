import { useEffect } from "react";
import { registerDefaultBusinessRules } from "../../utils/businessRules/registerDeafultRules";
import { registerDefaultOperators } from "../../utils/operators/registerDefaultOperators";
import { registerDefaultTransformers } from "../../utils/transfomers/registerDefaultTransformers";
import { registerDefaultValidators } from "../../utils/validation/registerDeafultValidators";
import { registerDefaultFields } from "../FormPage/components/registerDefaultFields";
import EventPageContent from "./components/EventPageContent";
import EventPageLayout from "./components/EventPageLayout";

const EventPage = () => {
    useEffect(() => {
        registerDefaultFields();
        registerDefaultValidators();
        registerDefaultOperators();
        registerDefaultTransformers();
        registerDefaultBusinessRules();
    }, []);

    return (
        <EventPageLayout>
            <EventPageContent />
        </EventPageLayout>
    );
};

export default EventPage;
