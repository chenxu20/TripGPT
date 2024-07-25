import React, { useEffect, useRef } from 'react';
import "./AlertMessage.css";

export class Alert {
    constructor(message, duration, type) {
        this.message = message;
        this.duration = duration;
        this.type = type;
    }
}

export const AlertMessage = ({ alert, setAlert }) => {
    const timerRef = useRef(null);

    useEffect(() => {
        if (alert) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
                setAlert(null);
            }, alert.duration);
        }

        return () => clearTimeout(timerRef.current);
    }, [alert]);

    if (!alert) return null;

    return (
        <div id="confirm-message" className={`confirm-message confirm-message-${alert.type}`}>
            {alert.message}
        </div>
    );
};