import { useState, useEffect } from "react";
import styles from "./About.module.css";
import { fetchEventInfo, type EventData } from "../../services/eventApi";

const About = () => {
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEventData = async () => {
            try {
                const data = await fetchEventInfo();
                setEventData(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load event data:", error);
                setLoading(false);
            }
        };

        loadEventData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!eventData) {
        return <div>Failed to load event data</div>;
    }

    return (
        <>
            <h1 className={styles.title}>{eventData.title}</h1>

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: eventData.description }}
            />

            <button className={styles.nextButton}>Next →</button>
        </>
    );
};

export default About;
