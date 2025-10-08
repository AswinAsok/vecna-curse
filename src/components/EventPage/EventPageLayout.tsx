import { EventDataContext } from "../../contexts/eventDataContext";
import { useEvent } from "../../hooks/useEvent";
import Footer from "../Footer/Footer";
import Error from "../ui/Error/Error";
import Loading from "../ui/Loading/Loading";
import styles from "./EventPageLayout.module.css";

const EventPageLayout = ({ children }: { children: React.ReactNode }) => {
    const { eventData, error, loading } = useEvent();

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
                        {children}
                        <Footer />
                    </div>
                </div>
            </div>
        </EventDataContext.Provider>
    );
};

export default EventPageLayout;
