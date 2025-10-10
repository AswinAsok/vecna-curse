import styles from "../FormPage.module.css";
import { usePagination } from "../hooks/usePagination.hook";

const FormPaginationLayout = ({ children }: { children: React.ReactNode }) => {
    const { currentPage, totalPages, handleNext, handlePrevious } = usePagination();

    return (
        <>
            {currentPage > 1 && (
                <p className={styles.backLink} onClick={handlePrevious}>
                    ← Back
                </p>
            )}
            {children}
            {currentPage < totalPages && (
                <button
                    type="button"
                    onClick={() => {
                        handleNext();
                    }}
                    className={styles.nextButton}
                >
                    Next
                </button>
            )}
        </>
    );
};

export default FormPaginationLayout;
