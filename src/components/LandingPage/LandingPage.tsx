import { useState } from "react";
import styles from "./LandingPage.module.css";
import About from "../About/About";
import Form from "../Form/Form";
import { fetchEventInfo } from "../../services/eventApi";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading";
import Error from "../Error";

const LandingPage = () => {
    const [showForm, setShowForm] = useState(false);

    const {
        data: eventData,
        error,
        isLoading: loading,
        refetch,
    } = useQuery({
        queryKey: ["eventData"],
        queryFn: () => fetchEventInfo(),
    });

    if (loading) {
        return <Loading color="white" />;
    }

    if (!error || !eventData) {
        return (
            <Error
                message="Failed to load event data. Please try again."
                onRetry={() => refetch()}
            />
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
                            <Form
                                formFields={eventData.form}
                                eventId={eventData.id}
                                eventTitle={eventData.title}
                                ticketId={eventData.tickets[0]?.id || ""}
                                onBack={() => setShowForm(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
