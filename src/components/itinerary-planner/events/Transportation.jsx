import React, { useState } from "react";

export const Transportation = ({ initialEventState, eventToEdit }) => {
    const [event, setEvent] = useState(eventToEdit || initialEventState);
    const [transportType, setTransportType] = useState(eventToEdit?.name || "");

    const handleChange = e => {
        const { name, value } = e.target;
        setEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = e => {
        const mode = e.target.value;
        setTransportType(mode);
        if (mode) {
            setEvent(prev => ({ ...prev, name: mode }));
        } else {
            setEvent(prev => ({ ...prev, name: "" }));
        }
    }

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
        setTransportType("");
    };

    const eventForm = () => (
        <>
            <div>
                <label>
                    Type
                    <select className="drop-down" id="transportation-type" name="name" value={transportType} onChange={handleTypeChange} required>
                        <option value="" disabled>Select</option>
                        <option value="bus">Bus</option>
                        <option value="car">Car</option>
                        <option value="ferry">Ferry</option>
                        <option value="train">Train</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Origin
                    <input
                        type="text"
                        name="origin"
                        value={event.origin}
                        onChange={handleChange}
                        placeholder="Origin"
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Destination
                    <input
                        type="text"
                        name="destination"
                        value={event.destination}
                        onChange={handleChange}
                        placeholder="Destination"
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Departure
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
                </label>
            </div>
            <div>
                <label>
                    Arrival
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
                </label>
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

function formatName(str) {
    if (str) {
        return str.charAt(0).toUpperCase() + str.substring(1) + " Ride";
    }
    return str;
}

export const TransportationDetails = ({ event, displayDateTime }) => (
    <>
        <div className="event-content-title">{formatName(event.name)}</div>
        <div>Origin: {event.origin}</div>
        <div>Departs {displayDateTime(event.startDate)}</div>
        <div>Destination: {event.destination}</div>
        <div>Arrives {displayDateTime(event.endDate)}</div>
    </>
);