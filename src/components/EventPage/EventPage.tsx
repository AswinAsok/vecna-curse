import styles from "./EventPage.module.css";
import About from "../About/About";
import Form from "../Form/Form";
import Footer from "../Footer/Footer";

import { EventDataContext } from "../../contexts/eventDataContext";
import Error from "../ui/Error/Error";
import Loading from "../ui/Loading/Loading";
import { useEvent } from "../../hooks/useEvent";

const EventPage = () => {
    const { eventData, error, loading, showForm, setShowForm } = useEvent();

    if (loading) {
        return <Loading color="white" />;
    }

    if (error || !eventData) {
        return (
            <Error
                message="It seems like the event details are wrong, currenly make sure you entered the correct details or try again later."
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <EventDataContext.Provider value={eventData}>
            <div className={styles.mainContainer}>
                <div className={styles.banner}>
                    <img
                        src="https://storage.tally.so/617c01de-61fe-457d-b13e-3ef7da9fde23/WhatsApp-Image-2025-10-06-at-14.17.21_173846c6.jpg"
                        alt=""
                        className={styles.imageBanner}
                    />

                    <div className={styles.backgroundContainer}>
                        <div className={styles.contentContainer}>
                            <img src="turnupblack.png" alt="" className={styles.turnUpLogo} />

                            {!showForm ? (
                                <About onNext={() => setShowForm(true)} />
                            ) : (
                                <Form onBack={() => setShowForm(false)} />
                            )}
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        </EventDataContext.Provider>
    );
};

export default EventPage;
