import styles from "./About.module.css";
import { type EventData } from "../../services/eventApi";
import { Button } from "../ui/Button/Button";
import { DateComponent } from "../ui/DateComponent/DateComponent";
import LocationComponent from "../ui/LocationComponent/LocationComponent";

interface AboutProps {
    eventData: EventData;
    onNext: () => void;
}

const About = ({ eventData, onNext }: AboutProps) => {
    return (
        <>
            <h1 className={styles.title}>{eventData.title}</h1>

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: eventData.description }}
            />

            <div className={styles.eventInfo}>
                <DateComponent eventData={eventData} />
                <LocationComponent eventData={eventData} />
            </div>

            <Button onClick={onNext}>Next →</Button>
        </>
    );
};

export default About;
