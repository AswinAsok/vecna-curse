import styles from "./About.module.css";
import { Button } from "../ui/Button/Button";
import { DateComponent } from "../ui/DateComponent/DateComponent";
import LocationComponent from "../ui/LocationComponent/LocationComponent";
import { useEventDataContext } from "../../contexts/eventDataContext";

interface AboutProps {
    onNext: () => void;
}

const About = ({ onNext }: AboutProps) => {
    const eventData = useEventDataContext();

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
