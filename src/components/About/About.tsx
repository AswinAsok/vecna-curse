import styles from "./About.module.css";

const About = () => {
    return (
        <>
            <h1 className={styles.title}>
                Vecna's Curse – Stranger Things
                <br /> Halloween Night
            </h1>

            <div className={styles.infoList}>
                <div className={styles.infoItem}>
                    <span className={styles.emoji}>📍</span>
                    <span>Kochi</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.emoji}>🎲</span>
                    <span>Invite Only. No entry without the mark.</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.emoji}>🧠</span>
                    <span>21+ ID Mandatory. Only the strong survive.</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.emoji}>🍷</span>
                    <span>21+ ID Mandatory (No alcohol will be served.)</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.emoji}>🩸</span>
                    <span>23+ ID Mandatory</span>
                </div>
            </div>

            <button className={styles.nextButton}>Next →</button>
        </>
    );
};

export default About;
