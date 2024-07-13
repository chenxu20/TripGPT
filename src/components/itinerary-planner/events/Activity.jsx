import React, { useState } from "react";

export const Activity = ({ initialEventState, eventToEdit }) => {
    const [event, setEvent] = useState(eventToEdit || initialEventState);
    const [disableEnd, setDisableEnd] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleEndCheckbox = () => {
        setDisableEnd(!disableEnd);
    };

    const setEventDetails = eventToEdit => {
        const startDate = eventToEdit.startDate.toDate();
        const startDateStr = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000).toISOString();
        const endDate = eventToEdit.endDate?.toDate();
        const endDateStr = endDate ? new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60 * 1000).toISOString() : "";
        setEvent({
            ...eventToEdit,
            startDate: startDateStr.substring(0, 10),
            startTime: startDateStr.substring(11, 16),
            endDate: endDateStr.substring(0, 10),
            endTime: endDateStr.substring(11, 16)
        });
        setDisableEnd(!endDate);
    };

    const resetEvent = () => {
        setEvent(initialEventState);
        setDisableEnd(false);
    };

    const eventForm = () => (
        <>
            <label>
                Name:
                <input
                    type="text"
                    name="name"
                    value={event.name}
                    onChange={handleChange}
                    placeholder="Activity name"
                    required
                />
            </label>
            <br />
            <label>
                Start:
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
            </label>
            <br />
            <label>
                End:
                <input
                    type="date"
                    name="endDate"
                    value={event.endDate}
                    onChange={handleChange}
                    disabled={disableEnd}
                    required={!disableEnd}
                />
                <input
                    type="time"
                    name="endTime"
                    value={event.endTime}
                    onChange={handleChange}
                    disabled={disableEnd}
                    required={!disableEnd}
                />
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={disableEnd}
                    onChange={handleEndCheckbox}
                />
                No end date
            </label>
            <br />
            <label>
                Location:
                <input
                    type="text"
                    name="location"
                    value={event.location}
                    onChange={handleChange}
                    placeholder="Location"
                />
            </label>
            <br />
            <label>
                Notes:
                <textarea
                    name="notes"
                    value={event.notes}
                    onChange={handleChange}
                    placeholder="Notes"
                />
            </label>
        </>
    );

    return {
        event,
        handleChange,
        disableEnd,
        handleEndCheckbox,
        setEventDetails,
        resetEvent,
        eventForm
    };
};

export const ActivityDetails = ({ event, displayDateTime }) => (
    <>
        <h3>{event.name}</h3>
        {event.endDate ? (
            <>
                <div>From: {displayDateTime(event.startDate)}</div>
                <div>To: {displayDateTime(event.endDate)}</div>
            </>
        ) : <div>At: {displayDateTime(event.startDate)}</div>}
        {event.location && <div>Location: {event.location}</div>}
        {event.notes && <div>Notes: {event.notes}</div>}
    </>
);