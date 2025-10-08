import styles from "./About.module.css";
import { DateComponent } from "../ui/DateComponent/DateComponent";
import LocationComponent from "../ui/LocationComponent/LocationComponent";
import { useEventDataContext } from "../../contexts/eventDataContext";

const About = () => {
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
        </>
    );
};

export default About;
