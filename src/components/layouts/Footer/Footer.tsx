import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <p className={styles.text}>
                        © {new Date().getFullYear()} Vecna's Curse. All rights reserved.
                    </p>
                    <p className={styles.tagline}>
                        The Mind Lair awaits your presence...
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
