import styles from "./Button.module.css";

export interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    ariaLabel?: string;
    className?: string;
}

export const Button = ({
    children,
    onClick,
    type = "button",
    disabled = false,
    ariaLabel,
    className,
}: ButtonProps) => {
    return (
        <button
            type={type}
            className={`${styles.buttonContainer} ${className || ""}`}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {children}
        </button>
    );
};
