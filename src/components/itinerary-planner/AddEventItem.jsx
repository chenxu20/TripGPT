import React, { useState, useContext, useEffect } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import { Accommodation } from './events/Accommodation';
import { Activity } from './events/Activity';
import { Attraction } from './events/Attraction';
import { Food } from './events/Food';
import { Flight } from './events/Flight';
import { Transportation } from './events/Transportation';
import { FaChevronLeft } from 'react-icons/fa';
import { Alert } from '../AlertMessage';
import "./style.css";

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

export const AddEventItem = ({ itiId, eventToEdit, setAlert }) => {
    const { addEventItem, updateEventItem, eventTypes } = useContext(ItineraryContext);
    const [step, setStep] = useState(Steps.SELECT_TYPE);
    const [activeType, setActiveType] = useState(eventTypes.NO_TYPE);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const initialEventState = { name: '', type: eventTypes.NO_TYPE, startDate: '', startTime: '', endDate: '', endTime: '' };
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
        if (isModalOpen) {
            if (eventToEdit) {
                setStep(Steps.INPUT_DETAILS);
                setActiveType(eventToEdit.type);

                const currentState = stateMap[eventToEdit.type];
                if (currentState && currentState.setEventDetails) {
                    currentState.setEventDetails(eventToEdit);
                } else {
                    setErrorMessage("Error: Bad event type.");
                }
            } else {
                setStep(Steps.SELECT_TYPE);
                resetForm();
            }
        }
    }, [isModalOpen, eventToEdit]);

    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setErrorMessage("");
        setIsModalOpen(false);
    }

    function resetForm() {
        Object.values(stateMap).forEach(state => {
            state.resetEvent?.();
        });
        setActiveType(eventTypes.NO_TYPE);
        setErrorMessage("");
    }

    const handleClear = () => {
        const currentState = stateMap[activeType];
        currentState.resetEvent?.();
        setErrorMessage("");
    };

    const handleEventTypeSelect = type => {
        setActiveType(type);
        setErrorMessage("");
        setStep(Steps.INPUT_DETAILS);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
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
                setAlert(new Alert("Event updated successfully.", 5000, "success"));
            } else {
                await addEventItem(itiId, newEvent);
                if (inboundFlight) {
                    await addEventItem(itiId, inboundFlight);
                }
                setStep(Steps.SELECT_TYPE);
                resetForm();
                setAlert(new Alert("Event added successfully.", 5000, "success"));
            }
        } catch (error) {
            setErrorMessage(error.message);
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
                        {errorMessage && <span>{errorMessage}</span>}
                    </>
                );
            case Steps.INPUT_DETAILS:
                return (
                    <form id="add-event-form" onSubmit={handleSubmit} autoComplete="off">
                        {renderDetailsForm()}
                        {errorMessage && <span>{errorMessage}</span>}
                        <div>
                            <div className="event-form-button-wrapper">
                                <button type="submit" className="itinerary-button" disabled={loading}>
                                    {loading
                                        ? eventToEdit ? "Updating..." : "Adding..."
                                        : `${eventToEdit ? "Update" : "Add"} ${capitalizeFirstLetter(activeType) || "Event"}`
                                    }
                                </button>
                                <button type="button" className="itinerary-button" onClick={handleClear}>Clear</button>
                            </div>
                        </div>

                    </form>
                );
            default:
                return <div>An Error occurred. Unable to display form.</div>;
        }
    };

    const renderDetailsForm = () => {
        const currentState = stateMap[activeType];
        return currentState ? currentState.eventForm() : <div>An Error occurred. Unable to display form.</div>;
    };

    return (
        <>
            {eventToEdit
                ? <button onClick={openModal} className="itinerary-button">Edit</button>
                : <button onClick={openModal} className="itinerary-button">Add Event</button>
            }
            {isModalOpen && (
                <div className="itinerary-modal">
                    <div className="itinerary-modal-overlay" onClick={closeModal}></div>
                    <div className="itinerary-modal-content">
                        <button className="itinerary-modal-close-button" onClick={closeModal}>&#10006;</button>
                        {step === Steps.INPUT_DETAILS && !eventToEdit &&
                            <button type="button" className="itinerary-modal-back-button" onClick={() => {
                                setStep(Steps.SELECT_TYPE);
                                setActiveType(eventTypes.NO_TYPE);
                            }}><FaChevronLeft />Event type</button>}
                        <h2>{eventToEdit ? "Edit" : "Add"} {capitalizeFirstLetter(activeType) || "Event"}</h2>
                        {renderForm()}
                    </div>
                </div>
            )}
        </>
    )
};