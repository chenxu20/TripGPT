import React, { useState } from "react";

export const Accommodation = ({ initialEventState, eventToEdit }) => {
    const [event, setEvent] = useState(eventToEdit || initialEventState);

    const handleChange = e => {
        const { name, value } = e.target;
        setEvent(prev => ({ ...prev, [name]: value }));
    };

    const setEventDetails = eventToEdit => {
        const startDate = eventToEdit.startDate.toDate();
        const startDateStr = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000).toISOString();
        const endDate = eventToEdit.endDate.toDate();
        const endDateStr = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60 * 1000).toISOString();
        setEvent({
            ...eventToEdit,
            startDate: startDateStr.substring(0, 10),
            startTime: startDateStr.substring(11, 16),
            endDate: endDateStr.substring(0, 10),
            endTime: endDateStr.substring(11, 16)
        });
    };

    const resetEvent = () => {
        setEvent(initialEventState);
    };

    const eventForm = () => (
        <>
            <div>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={event.name}
                    onChange={handleChange}
                    placeholder="Accommodation name"
                    required
                />
            </div>
            <div>
                <label>Address</label>
                <textarea
                    name="address"
                    value={event.address}
                    onChange={handleChange}
                    placeholder="Accommodation address"
                    required
                />
            </div>
            <div>
                <label>Check in</label>
                <div className="event-form-datetime">
                    <input
                        type="date"
                        name="startDate"
                        value={event.startDate}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="time"
                        name="startTime"
                        value={event.startTime}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div>
                <label>Check out</label>
                <div className="event-form-datetime">
                    <input
                        type="date"
                        name="endDate"
                        value={event.endDate}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="time"
                        name="endTime"
                        value={event.endTime}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
        </>
    );

    return {
        event,
        handleChange,
        setEventDetails,
        resetEvent,
        eventForm
    };
};

export const AccommodationDetails = ({ event, displayDateTime }) => (
    <>
        <div className="event-content-title">{event.name}</div>
        <div>Address: {event.address}</div>
        <div>Check in: {displayDateTime(event.startDate)}</div>
        <div>Check out: {displayDateTime(event.endDate)}</div>
    </>
);