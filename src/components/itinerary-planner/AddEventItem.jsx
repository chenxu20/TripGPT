import React, { useState, useContext, useEffect } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import "./style.css";

const Steps = {
    SELECT_TYPE: 0,
    INPUT_DETAILS: 1
};

const Types = {
    ACCOMMODATION: "accommodation",
    ACTIVITY: "activity",
    FLIGHT: "flight",
    NO_TYPE: ""
};

function capitalizeFirstLetter(str) {
    if (str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }
    return str;
}

export const AddEventItem = ({ itiId, isOpen, closeModal, isEditing, eventToEdit, eventMessage, setEventMessage }) => {
    const { addEventItem, updateEventItem, error } = useContext(ItineraryContext);
    const initialEventState = { name: '', type: Types.NO_TYPE, startDate: '', startTime: '', endDate: '', endTime: '' };
    const [event, setEvent] = useState(initialEventState);
    const [disableEnd, setDisableEnd] = useState(false);
    const [step, setStep] = useState(Steps.SELECT_TYPE);

    useEffect(() => {
        if (isOpen) {
            if (isEditing && eventToEdit) {
                setStep(Steps.INPUT_DETAILS);
                const startDate = eventToEdit.startDate.toDate();
                const startDateStr = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000).toISOString();
                const endDate = eventToEdit.endDate?.toDate();
                const endDateStr = endDate ? new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60 * 1000).toISOString() : "";
                setEvent({
                    ...eventToEdit,
                    startDate: startDateStr.substring(0, 10),
                    startTime: startDateStr.substring(11, 16),
                    endDate: endDateStr?.substring(0, 10),
                    endTime: endDateStr?.substring(11, 16)
                });
                setDisableEnd(!endDate);
            } else {
                setStep(Steps.SELECT_TYPE);
                resetForm();
            }
        }
    }, [isOpen, isEditing, eventToEdit]);

    useEffect(() => {
        if (error) {
            setEventMessage(error);
        }
    }, [error, setEventMessage]);

    function resetForm() {
        setDisableEnd(false);
        setEvent(initialEventState);
    }

    const handleTypeSelect = (type) => {
        setEvent(prev => ({ ...prev, type }));
        setStep(Steps.INPUT_DETAILS);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleEndCheckbox = () => {
        setDisableEnd(!disableEnd);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const startDateTime = new Date(`${event.startDate}T${event.startTime}`);
        const endDateTime = disableEnd ? null : new Date(`${event.endDate}T${event.endTime}`);
        if (!disableEnd && startDateTime >= endDateTime) {
            setEventMessage("Start date and time must be before end date and time.");
            return;
        }

        let newEvent;
        switch (event.type) {
            case Types.ACCOMMODATION:
                newEvent = {
                    type: event.type,
                    name: event.name,
                    startDate: startDateTime,
                    endDate: endDateTime
                };
                break;
            case Types.ACTIVITY:
                newEvent = {
                    type: event.type,
                    name: event.name,
                    startDate: startDateTime,
                    endDate: endDateTime
                };
                break;
            case Types.FLIGHT:
                newEvent = {
                    type: event.type,
                    name: event.name,
                    startDate: startDateTime,
                    endDate: endDateTime
                };
                break;
            default:
                setEventMessage("Error setting event type.");
                return;
        }

        try {
            if (isEditing) {
                await updateEventItem(itiId, eventToEdit.id, newEvent);
                setEventMessage("Event updated successfully.");
            } else {
                await addEventItem(itiId, newEvent);
                setEventMessage("Event added successfully.");
                setStep(Steps.SELECT_TYPE);
                resetForm();
            }
        } catch (error) {
            setEventMessage("An error occurred. Try again.");
        }
    };

    const renderForm = () => {
        switch (step) {
            case Steps.SELECT_TYPE:
                return (
                    <>
                        <h3>Select Event type</h3>
                        <button onClick={() => handleTypeSelect(Types.FLIGHT)}>Flight</button>
                        <button onClick={() => handleTypeSelect(Types.ACCOMMODATION)}>Accommodation</button>
                        <button onClick={() => handleTypeSelect(Types.ACTIVITY)}>Activity</button>
                    </>
                );
            case Steps.INPUT_DETAILS:
                return (
                    <form onSubmit={handleSubmit}>
                        {renderDetailsForm()}
                        <br />
                        <button type="submit">{isEditing ? "Update" : "Add"} Event</button>
                        {isEditing && <button type="button" onClick={resetForm}>Clear</button>}
                        <br />
                        {eventMessage && <span>{eventMessage}</span>}
                    </form>
                );
            default:
                return <div>An Error occurred. Try again.</div>;
        }
    }

    const renderDetailsForm = () => {
        switch (event.type) {
            case Types.ACCOMMODATION:
                return (
                    <>
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={event.name}
                                onChange={handleChange}
                                placeholder="Accommodation name"
                                required
                            />
                        </label>
                        <br />
                        <label>
                            Check in:
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
                            Check out:
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
                    </>
                );
            case Types.ACTIVITY:
                return (
                    <>
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={event.name}
                                onChange={handleChange}
                                placeholder="Event name"
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
                    </>
                );
            case Types.FLIGHT:
                return (
                    <>
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
                    </>
                )
            default:
                return <div>An Error occurred. Try again.</div>;
        }
    };

    return isOpen && (
        <div className="event-modal">
            <div className="event-modal-overlay" onClick={closeModal}></div>
            <div className="event-modal-content">
                <button className="event-modal-close" onClick={closeModal}>X</button>
                {step === Steps.INPUT_DETAILS && 
                    <button type="button" onClick={() => setStep(Steps.SELECT_TYPE)}>Back</button>}
                <h2>{isEditing ? "Edit" : "Add"} {capitalizeFirstLetter(event.type) || "Event"}</h2>
                {renderForm()}
            </div>
        </div>
    );
};