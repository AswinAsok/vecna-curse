import { DateComponent } from "@/components/ui/DateComponent/DateComponent";
import LocationComponent from "@/components/ui/LocationComponent/LocationComponent";
import { useEventDataContext } from "@/features/form";

import styles from "./About.module.css";

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
