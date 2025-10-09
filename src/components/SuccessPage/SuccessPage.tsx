import styles from "./SuccessPage.module.css";

const SuccessPage = () => {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.additionalContent}>
                    <h2 className={styles.heading}>
                        ⏱️ Your answers are in. The Mind Lair will decide.
                    </h2>
                    <p className={styles.paragraph}>
                        If chosen, your DM will hit like the 4th chime.
                    </p>
                    <p className={styles.paragraph}>
                        Private Insta? Feels like hiding from the curse.
                    </p>
                    <p className={styles.paragraph}>No plus-ones — unless marked.</p>
                    <p className={styles.paragraph}>Wrong number? You vanish before we call.</p>

                    <h2 className={styles.heading}>🕷️ Engage Or Be Forgotten.</h2>
                    <p className={styles.paragraph}>
                        Like, save, comment — every tap calls Vecna closer.
                    </p>
                    <p className={styles.paragraph}>
                        Share our reel to your story & tag us — the Lair is watching.
                    </p>
                    <p className={styles.paragraph}>
                        The louder your noise, the faster the possession begins.
                    </p>
                </div>
            </div>
        </>
    );
};

export default SuccessPage;
