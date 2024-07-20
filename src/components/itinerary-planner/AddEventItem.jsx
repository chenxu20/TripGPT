import React, { useState, useContext, useEffect } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import "./style.css";
import { Accommodation } from './events/Accommodation';
import { Activity } from './events/Activity';
import { Attraction } from './events/Attraction';
import { Food } from './events/Food';
import { Flight } from './events/Flight';
import { Transportation } from './events/Transportation';
import { FaChevronLeft } from 'react-icons/fa';

//Enum managing form step
const Steps = {
    SELECT_TYPE: 0,
    INPUT_DETAILS: 1
};

function capitalizeFirstLetter(str) {
    if (str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }
    return str;
}

function createDateTime(date, time) {
    return new Date(`${date}T${time}`);
}

export const AddEventItem = ({ itiId, isOpen, closeModal, eventToEdit, eventMessage, setEventMessage }) => {
    const { addEventItem, updateEventItem, error, eventTypes } = useContext(ItineraryContext);
    const initialEventState = { name: '', type: eventTypes.NO_TYPE, startDate: '', startTime: '', endDate: '', endTime: '' };
    const [step, setStep] = useState(Steps.SELECT_TYPE);
    const [activeType, setActiveType] = useState(eventTypes.NO_TYPE);
    const [loading, setLoading] = useState(false);

    const stateMap = {
        [eventTypes.ACCOMMODATION]: Accommodation({
            initialEventState: {
                ...initialEventState,
                type: eventTypes.ACCOMMODATION,
                address: ""
            }, eventToEdit
        }),
        [eventTypes.ACTIVITY]: Activity({
            initialEventState: {
                ...initialEventState,
                type: eventTypes.ACTIVITY,
                location: "",
                notes: ""
            }, eventToEdit
        }),
        [eventTypes.ATTRACTION]: Attraction({
            initialEventState: {
                ...initialEventState,
                type: eventTypes.ATTRACTION,
                address: ""
            }, eventToEdit
        }),
        [eventTypes.FLIGHT]: Flight({
            initialEventState: {
                ...initialEventState,
                type: eventTypes.FLIGHT,
                origin: "",
                destination: ""
            }, eventToEdit
        }),
        [eventTypes.FOOD]: Food({
            initialEventState: {
                ...initialEventState,
                type: eventTypes.FOOD,
                address: "",
                notes: ""
            }, eventToEdit
        }),
        [eventTypes.TRANSPORTATION]: Transportation({
            initialEventState: {
                ...initialEventState,
                type: eventTypes.TRANSPORTATION,
                origin: "",
                destination: ""
            }, eventToEdit
        })
    };

    useEffect(() => {
        if (isOpen) {
            if (eventToEdit) {
                setStep(Steps.INPUT_DETAILS);
                setActiveType(eventToEdit.type);

                const currentState = stateMap[eventToEdit.type];
                if (currentState && currentState.setEventDetails) {
                    currentState.setEventDetails(eventToEdit);
                } else {
                    setEventMessage("An error occurred. Try again later.");
                }
            } else {
                setStep(Steps.SELECT_TYPE);
                resetForm();
            }
        }
    }, [isOpen, eventToEdit]);

    useEffect(() => {
        setEventMessage(error ?? "");
    }, [error, setEventMessage]);

    function resetForm() {
        Object.values(stateMap).forEach(state => {
            state.resetEvent?.();
        });
        setActiveType(eventTypes.NO_TYPE);
        setEventMessage("");
    }

    const handleClear = () => {
        const currentState = stateMap[activeType];
        currentState.resetEvent?.();
    };

    const handleEventTypeSelect = type => {
        setActiveType(type);
        setStep(Steps.INPUT_DETAILS);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const currentState = stateMap[activeType];
            if (!currentState) {
                throw new Error("Error: Bad event type.");
            }
            
            const startDateTime = createDateTime(currentState.event.startDate, currentState.event.startTime);
            const endDateTime = currentState.disableEnd ? null : createDateTime(currentState.event.endDate, currentState.event.endTime);

            if (endDateTime && startDateTime >= endDateTime) {
                throw new Error("Start date and time must be before end date and time.");
            }

            const newEvent = {
                ...(currentState.event),
                startDate: startDateTime,
                endDate: endDateTime
            };

            delete newEvent.startTime;
            delete newEvent.endTime;

            let inboundFlight;
            if (activeType === eventTypes.FLIGHT && currentState.isRoundTrip) {
                const inboundStartDateTime = createDateTime(currentState.inbound.inboundStartDate, currentState.inbound.inboundStartTime);
                const inboundEndDateTime = createDateTime(currentState.inbound.inboundEndDate, currentState.inbound.inboundEndTime);

                if (inboundStartDateTime >= inboundEndDateTime) {
                    throw new Error("Start date and time must be before end date and time.");
                }

                if (endDateTime >= inboundStartDateTime) {
                    throw new Error("Inbound flight should be after outbound flight.");
                }

                inboundFlight = {
                    name: currentState.inbound.inboundName,
                    type: activeType,
                    startDate: inboundStartDateTime,
                    endDate: inboundEndDateTime,
                    origin: currentState.event.destination,
                    destination: currentState.event.origin
                };
            }
            if (eventToEdit) {
                await updateEventItem(itiId, eventToEdit.id, newEvent);
                setEventMessage("Event updated successfully.");
            } else {
                await addEventItem(itiId, newEvent);
                if (inboundFlight) {
                    await addEventItem(itiId, inboundFlight);
                }
                setEventMessage("Event added successfully.");
                setStep(Steps.SELECT_TYPE);
                resetForm();
            }
        } catch (error) {
            setEventMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderForm = () => {
        switch (step) {
            case Steps.SELECT_TYPE:
                return (
                    <>
                        <h3>Select Event type</h3>
                        <div className="event-types-wrapper">
                            <button className="event-types-button" onClick={() => handleEventTypeSelect(eventTypes.FLIGHT)}>Flight</button>
                            <button className="event-types-button" onClick={() => handleEventTypeSelect(eventTypes.ACCOMMODATION)}>Accommodation</button>
                            <button className="event-types-button" onClick={() => handleEventTypeSelect(eventTypes.ATTRACTION)}>Attraction</button>
                            <button className="event-types-button" onClick={() => handleEventTypeSelect(eventTypes.FOOD)}>Food</button>
                            <button className="event-types-button" onClick={() => handleEventTypeSelect(eventTypes.TRANSPORTATION)}>Transportation</button>
                            <button className="event-types-button" onClick={() => handleEventTypeSelect(eventTypes.ACTIVITY)}>Activity</button>
                        </div>
                    </>
                );
            case Steps.INPUT_DETAILS:
                return (
                    <form id="add-event-form" onSubmit={handleSubmit} autoComplete="off">
                        {renderDetailsForm()}
                        <div>
                            <div className="event-form-button-wrapper">
                                <button type="submit" className="itinerary-button" disabled={loading}>
                                    {eventToEdit ? "Update" : "Add"} {capitalizeFirstLetter(activeType) || "Event"}
                                </button>
                                <button type="button" className="itinerary-button" onClick={handleClear}>Clear</button>
                            </div>
                        </div>
                        {eventMessage && <span>{eventMessage}</span>}
                    </form>
                );
            default:
                return <div>An Error occurred. Try again.</div>;
        }
    };

    const renderDetailsForm = () => {
        const currentState = stateMap[activeType];
        return currentState ? currentState.eventForm() : <div>An Error occurred. Try again.</div>;
    };

    return isOpen && (
        <div className="itinerary-modal">
            <div className="itinerary-modal-overlay" onClick={closeModal}></div>
            <div className="itinerary-modal-content">
                <button className="itinerary-modal-close-button" onClick={closeModal}>X</button>
                {step === Steps.INPUT_DETAILS && !eventToEdit &&
                    <button type="button" className="itinerary-modal-back-button" onClick={() => {
                        setStep(Steps.SELECT_TYPE);
                        setActiveType(eventTypes.NO_TYPE);
                    }}><FaChevronLeft />Event type</button>}
                <h2>{eventToEdit ? "Edit" : "Add"} {capitalizeFirstLetter(activeType) || "Event"}</h2>
                {renderForm()}
            </div>
        </div>
    );
};