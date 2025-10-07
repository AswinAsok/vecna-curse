import { HashLoader } from "react-spinners";
import styles from "../App.module.css";

interface LoadingProps {
    size?: number;
    color?: string;
}

const Loading = ({ size = 50, color = "#36d7b7" }: LoadingProps) => {
    return (
        <div className={styles.loadingBackgroundContainer}>
            <HashLoader color={color} size={size} />
        </div>
    );
};

export default Loading;
