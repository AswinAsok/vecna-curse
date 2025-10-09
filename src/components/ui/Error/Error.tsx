import { Button } from "../Button/Button";
import styles from "./Error.module.css";

interface ErrorProps {
    message?: string;
    onRetry?: () => void;
}

const Error = ({ message = "Something went wrong. Please try again.", onRetry }: ErrorProps) => {
    return (
        <div className={styles.loadingBackgroundContainer}>
            <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>{message}</p>
                {onRetry && <Button onClick={onRetry}> Try Again</Button>}
            </div>
        </div>
    );
};

export default Error;
