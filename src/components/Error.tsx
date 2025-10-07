import styles from "../App.module.css";

interface ErrorProps {
    message?: string;
    onRetry?: () => void;
}

const Error = ({ message = "Something went wrong. Please try again.", onRetry }: ErrorProps) => {
    return (
        <div className={styles.loadingBackgroundContainer}>
            <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>{message}</p>
                {onRetry && (
                    <button onClick={onRetry} className={styles.retryButton}>
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default Error;
