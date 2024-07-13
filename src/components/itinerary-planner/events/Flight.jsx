import React, { useState } from "react";

export const Flight = ({ initialEventState, eventToEdit }) => {
    const [event, setEvent] = useState(eventToEdit || initialEventState);
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const initialInboundState = { inboundName: '', inboundStartDate: '', inboundStartTime: '', inboundEndDate: '', inboundEndTime: '' };
    const [inbound, setInbound] = useState(initialInboundState);

    const handleChange = e => {
        const { name, value } = e.target;
        setEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleInboundChange = e => {
        const { name, value } = e.target;
        setInbound(prev => ({ ...prev, [name]: value }));
    };

    const handleFlightTypeChange = e => {
        setIsRoundTrip(e.target.value === "roundTrip");
    };

    const setEventDetails = eventToEdit => {
        const startDate = eventToEdit.startDate.toDate();
        const startDateStr = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000).toISOString();
        const endDate = eventToEdit.endDate.toDate();
        const endDateStr = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60 * 1000).toISOString();

        setIsRoundTrip(false);
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
        setIsRoundTrip(false);
        setInbound(initialInboundState);
    };

    const eventForm = () => (
        <>
            {!eventToEdit && (
                <>
                    <label>
                        <input
                            type="radio"
                            name="flightType"
                            value="oneWay"
                            checked={!isRoundTrip}
                            onChange={handleFlightTypeChange}
                        />
                        One Way
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="flightType"
                            value="roundTrip"
                            checked={isRoundTrip}
                            onChange={handleFlightTypeChange}
                        />
                        Round Trip
                    </label>
                    <br />
                </>
            )}
            <label>
                Flight origin:
                <input
                    type="text"
                    name="origin"
                    value={event.origin}
                    onChange={handleChange}
                    placeholder="Flight origin"
                    required
                />
            </label>
            <br />
            <label>
                Flight destination:
                <input
                    type="text"
                    name="destination"
                    value={event.destination}
                    onChange={handleChange}
                    placeholder="Flight destination"
                    required
                />
            </label>
            <br />
            <label>
                Flight number:
                <input
                    type="text"
                    name="name"
                    value={event.name}
                    onChange={handleChange}
                    placeholder="Flight number"
                    required
                />
            </label>
            <br />
            <label>
                Departs at:
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
                Arrives at:
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
            </label>
            {isRoundTrip && (
                <>
                    <br />
                    <label>
                        Flight number:
                        <input
                            type="text"
                            name="inboundName"
                            value={inbound.inboundName}
                            onChange={handleInboundChange}
                            placeholder="Flight number"
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Departs at:
                        <input
                            type="date"
                            name="inboundStartDate"
                            value={inbound.inboundStartDate}
                            onChange={handleInboundChange}
                            required
                        />
                        <input
                            type="time"
                            name="inboundStartTime"
                            value={inbound.inboundStartTime}
                            onChange={handleInboundChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Arrives at:
                        <input
                            type="date"
                            name="inboundEndDate"
                            value={inbound.inboundEndDate}
                            onChange={handleInboundChange}
                            required
                        />
                        <input
                            type="time"
                            name="inboundEndTime"
                            value={inbound.inboundEndTime}
                            onChange={handleInboundChange}
                            required
                        />
                    </label>
                </>
            )}
        </>
    );

    return {
        event,
        inbound,
        handleChange,
        handleInboundChange,
        isRoundTrip,
        handleFlightTypeChange,
        setEventDetails,
        resetEvent,
        eventForm
    };
};

export const FlightDetails = ({ event, displayDateTime }) => (
    <>
        <h3>Flight {event.name}</h3>
        <div>Origin: {event.origin}</div>
        <div>Departs {displayDateTime(event.startDate)}</div>
        <div>Destination: {event.destination}</div>
        <div>Arrives {displayDateTime(event.endDate)}</div>
    </>
);