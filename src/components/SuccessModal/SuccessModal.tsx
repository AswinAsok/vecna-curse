import styles from "./SuccessModal.module.css";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    followupMsg: string;
}

const SuccessModal = ({ isOpen, onClose, followupMsg }: SuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.successIcon}>✓</div>
                <h2 className={styles.title}>Success!</h2>
                {followupMsg && (
                    <div
                        className={styles.followupMessage}
                        dangerouslySetInnerHTML={{ __html: followupMsg }}
                    />
                )}
                <div className={styles.buttonContainer}>
                    <button onClick={onClose} className={styles.closeButton}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
