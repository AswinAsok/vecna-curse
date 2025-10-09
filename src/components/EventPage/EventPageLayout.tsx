import { EventDataContext } from "../../contexts/eventDataContext";
import { useFetchEventInfo } from "./EventPageLayout.hooks";
import Footer from "../Footer/Footer";
import Error from "../ui/Error/Error";
import Loading from "../ui/Loading/Loading";
import styles from "./EventPageLayout.module.css";

const EventPageLayout = ({ children }: { children: React.ReactNode }) => {
    const { eventData, error, loading } = useFetchEventInfo();

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
                    <img src={eventData.banner} alt="" className={styles.imageBanner} />

                    <div className={styles.backgroundContainer}>
                        <div className={styles.childrenContainer}>
                            <img src="/turnupblack.png" alt="" className={styles.turnUpLogo} />
                            {children}
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        </EventDataContext.Provider>
    );
};

export default EventPageLayout;
