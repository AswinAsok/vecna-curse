import styles from "./Button.module.css";

export const Button = ({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick: () => void;
}) => {
    return (
        <div className={styles.buttonContainer} onClick={onClick}>
            {children}
        </div>
    );
};
