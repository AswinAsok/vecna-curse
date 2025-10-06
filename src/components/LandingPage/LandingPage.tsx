import { useState, useEffect } from "react";
import styles from "./LandingPage.module.css";
import About from "../About/About";
import Form from "../Form/Form";
import { fetchEventInfo, type EventData } from "../../services/eventApi";

const LandingPage = () => {
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const loadEventData = async () => {
            try {
                const data = await fetchEventInfo();
                setEventData(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load event data:", error);
                setError(true);
                setLoading(false);
            }
        };

        loadEventData();
    }, []);

    if (loading) {
        return (
            <div className={styles.mainContainer}>
                <div>Loading...</div>
            </div>
        );
    }

    if (error || !eventData) {
        return (
            <div className={styles.mainContainer}>
                <div>Failed to load event data</div>
            </div>
        );
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.banner}>
                <img
                    src="https://storage.tally.so/617c01de-61fe-457d-b13e-3ef7da9fde23/WhatsApp-Image-2025-10-06-at-14.17.21_173846c6.jpg"
                    alt=""
                    className={styles.imageBanner}
                />

                <div className={styles.backgroundContainer}>
                    <div className={styles.contentContainer}>
                        <img
                            src="https://storage.tally.so/7528d5ea-7f1d-439a-8bda-136d2d15b236/640640.png"
                            alt=""
                            className={styles.turnUpLogo}
                        />

                        {!showForm ? (
                            <About eventData={eventData} onNext={() => setShowForm(true)} />
                        ) : (
                            <Form formFields={eventData.form} onBack={() => setShowForm(false)} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
