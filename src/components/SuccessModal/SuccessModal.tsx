import styles from "./SuccessModal.module.css";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    followupMsg: string;
    eventRegisterId: string;
    eventTitle: string;
}

const SuccessModal = ({ isOpen, onClose, followupMsg, eventRegisterId, eventTitle }: SuccessModalProps) => {
    if (!isOpen) return null;

    const handleViewTicket = () => {
        window.open(`https://app.makemypass.com/${eventTitle}/view-ticket/${eventRegisterId}`, '_blank');
    };

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
                    <button onClick={handleViewTicket} className={styles.viewTicketButton}>
                        View Ticket
                    </button>
                    <button onClick={onClose} className={styles.closeButton}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
