import { EventDataContext } from "../../form";

import Footer from "../../../components/Footer/Footer";
import Error from "../../../components/ui/Error/Error";
import Loading from "../../../components/ui/Loading/Loading";
import SEO from "../../../components/SEO/SEO";
import { useFetchEventInfo } from "../hooks/EventPageLayout.hooks";
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
            <SEO />
            <div className={styles.mainContainer}>
                <div className={styles.banner}>
                    <img src={eventData.banner} alt="" className={styles.imageBanner} />

                    <div className={styles.backgroundContainer}>
                        <div className={styles.childrenContainer}>
                            <img
                                src="images/logos/turnup-black.png"
                                alt=""
                                className={styles.turnUpLogo}
                            />
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
