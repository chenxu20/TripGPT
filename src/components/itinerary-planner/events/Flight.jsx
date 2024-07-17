import React, { useState } from "react";

export const Flight = ({ initialEventState, eventToEdit }) => {
    const [event, setEvent] = useState(eventToEdit || initialEventState);
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const initialInboundState = { inboundName: '', inboundStartDate: '', inboundStartTime: '', inboundEndDate: '', inboundEndTime: '' };
    const [inbound, setInbound] = useState(initialInboundState);

    const handleChange = e => {
        const { name, value } = e.target;
        const newValue = name === "name" ? value.toUpperCase() : value;
        setEvent(prev => ({ ...prev, [name]: newValue }));
    };

    const handleInboundChange = e => {
        const { name, value } = e.target;
        const newValue = name === "inboundName" ? value.toUpperCase() : value;
        setInbound(prev => ({ ...prev, [name]: newValue }));
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
                <div id="flight-roundtrip-selection">
                    <input
                        type="radio"
                        id="one-way"
                        name="flightType"
                        value="oneWay"
                        checked={!isRoundTrip}
                        onChange={handleFlightTypeChange}
                    />
                    <label htmlFor="one-way">One Way</label>
                    <input
                        type="radio"
                        id="round-trip"
                        name="flightType"
                        value="roundTrip"
                        checked={isRoundTrip}
                        onChange={handleFlightTypeChange}
                    />
                    <label htmlFor="round-trip">Round Trip</label>
                </div>
            )}
            <div>
                <label>Origin</label>
                <input
                    type="text"
                    name="origin"
                    value={event.origin}
                    onChange={handleChange}
                    placeholder="Flight origin"
                    required
                />
            </div>
            <div>
                <label>Destination</label>
                <input
                    type="text"
                    name="destination"
                    value={event.destination}
                    onChange={handleChange}
                    placeholder="Flight destination"
                    required
                />
            </div>
            {isRoundTrip && <div><div className='flight-divider'>Outbound flight</div></div>}
            <div>
                <label>Flight number</label>
                <input
                    type="text"
                    name="name"
                    value={event.name}
                    onChange={handleChange}
                    placeholder="Flight number"
                    required
                />
            </div>
            <div>
                <label>Departure</label>
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
                <label>Arrival</label>
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
            {isRoundTrip && (
                <>
                    <div><div className="flight-divider">Inbound flight</div></div>
                    <div>
                        <label>Flight number</label>
                        <input
                            type="text"
                            name="inboundName"
                            value={inbound.inboundName}
                            onChange={handleInboundChange}
                            placeholder="Flight number"
                            required
                        />

                    </div>
                    <div>
                        <label>Departure</label>
                        <div className="event-form-datetime">
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
                        </div>
                    </div>
                    <div>
                        <label>Arrival</label>
                        <div className="event-form-datetime">
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
                        </div>
                    </div>
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
        <div className="event-content-title">{event.name}</div>
        <div>Origin: {event.origin}</div>
        <div>Departs {displayDateTime(event.startDate)}</div>
        <div>Destination: {event.destination}</div>
        <div>Arrives {displayDateTime(event.endDate)}</div>
    </>
);