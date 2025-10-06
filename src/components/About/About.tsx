import styles from "./About.module.css";
import { type EventData } from "../../services/eventApi";

interface AboutProps {
    eventData: EventData;
}

const About = ({ eventData }: AboutProps) => {
    const startDate = new Date(eventData.event_start_date);
    const endDate = new Date(eventData.event_end_date);

    const formatFullDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).toLowerCase();
    };

    const formatDayWithSuffix = (date: Date) => {
        const day = date.getDate();
        const suffix = day === 1 || day === 21 || day === 31 ? 'st'
                     : day === 2 || day === 22 ? 'nd'
                     : day === 3 || day === 23 ? 'rd'
                     : 'th';
        return `${date.toLocaleDateString('en-US', { weekday: 'long' })} ${day}${suffix}`;
    };

    return (
        <>
            <h1 className={styles.title}>{eventData.title}</h1>

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: eventData.description }}
            />

            <div className={styles.eventInfo}>
                <div className={styles.dateSection}>
                    <div className={styles.dateIcon}>
                        <div className={styles.month}>{startDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</div>
                        <div className={styles.day}>{startDate.getDate()}</div>
                    </div>
                    <div className={styles.dateDetails}>
                        <div className={styles.fullDate}>{formatFullDate(startDate)}</div>
                        <div className={styles.timeRange}>
                            {formatTime(startDate)} - {formatDayWithSuffix(endDate)} {formatTime(endDate)}
                        </div>
                    </div>
                </div>

                <div className={styles.locationSection}>
                    <svg className={styles.locationIcon} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <div className={styles.locationText}>{eventData.place}</div>
                </div>
            </div>

            <button className={styles.nextButton}>Next →</button>
        </>
    );
};

export default About;
