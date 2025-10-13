import type { ReactNode } from "react";

import styles from "../FormPage.module.css";

interface BaseFieldProps {
    id: string;
    title: string;
    required: boolean;
    description: string | null;
    children: ReactNode;
}

const BaseFieldWrapper = ({ id, title, required, description, children }: BaseFieldProps) => {
    return (
        <div key={id} className={styles.fieldContainer}>
            <label className={styles.label}>
                {title}
                {required && <span className={styles.required}>*</span>}
            </label>
            {description && <p className={styles.description}>{description}</p>}
            {children}
        </div>
    );
};

export default BaseFieldWrapper;
