import styles from "./LandingPage.module.css";
import About from "../About/About";

const LandingPage = () => {
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

                        <About />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
