import type { EventData } from "../../../types/event.types";
import styles from "./DateComponent.module.css";

export const DateComponent = ({ eventData }: { eventData: EventData }) => {
    const startDate = new Date(eventData.event_start_date);
    const endDate = new Date(eventData.event_end_date);
    return (
        <div className={styles.dateSection}>
            <div className={styles.dateIcon}>
                <div className={styles.month}>
                    {startDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
                </div>
                <div className={styles.day}>{startDate.getDate()}</div>
            </div>
            <div className={styles.dateDetails}>
                <div className={styles.fullDate}>{formatFullDate(startDate)}</div>
                <div className={styles.timeRange}>
                    {`${formatTime(startDate)} ${
                        eventData.event_end_date
                            ? ` - ${formatDayWithSuffix(endDate)} ${formatTime(endDate)}`
                            : ""
                    }`}
                </div>
            </div>
        </div>
    );
};

const formatFullDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const formatTime = (date: Date) => {
    return date
        .toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
        .toLowerCase();
};

const formatDayWithSuffix = (date: Date) => {
    const day = date.getDate();
    const suffix =
        day === 1 || day === 21 || day === 31
            ? "st"
            : day === 2 || day === 22
            ? "nd"
            : day === 3 || day === 23
            ? "rd"
            : "th";
    return `${date.toLocaleDateString("en-US", { weekday: "long" })} ${day}${suffix}`;
};
