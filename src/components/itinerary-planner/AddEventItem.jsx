import React, { useState, useContext, useEffect } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import "./style.css";

export const AddEventItem = ({ itiId, isOpen, closeModal, isEditing, eventToEdit, eventMessage, setEventMessage }) => {
    const { addEventItem, updateEventItem, error } = useContext(ItineraryContext);
    const initialEventState = { name: '', startDate: '', startTime: '', endDate: '', endTime: '' };
    const [event, setEvent] = useState(initialEventState);
    const [disableEnd, setDisableEnd] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (isEditing && eventToEdit) {
                const startDate = eventToEdit.startDate.toDate();
                const endDate = eventToEdit.endDate ? eventToEdit.endDate.toDate() : null;
                setEvent({
                    name: eventToEdit.name,
                    startDate: startDate.toISOString().split('T')[0],
                    startTime: startDate.toTimeString().slice(0, 5),
                    endDate: endDate ? endDate.toISOString().split('T')[0] : '',
                    endTime: endDate ? endDate.toTimeString().slice(0, 5) : ''
                });
                setDisableEnd(!endDate);
            } else {
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
        const newEvent = {
            name: event.name,
            startDate: startDateTime,
            endDate: endDateTime
        };
        if (!disableEnd && startDateTime >= endDateTime) {
            setEventMessage("Start date and time must be before end date and time.");
            return;
        }
        try {
            if (isEditing) {
                await updateEventItem(itiId, eventToEdit.id, newEvent);
                setEventMessage("Event updated successfully.");
            } else {
                await addEventItem(itiId, newEvent);
                setEventMessage("Event added successfully.");
                resetForm();
            }
        } catch (error) {
            setEventMessage("An error occurred. Try again.");
        }
    };

    return isOpen && (
        <div className="event-modal">
            <div className="event-modal-overlay" onClick={closeModal}></div>
            <div className="event-modal-content">
                <button className="event-modal-close" onClick={closeModal}>X</button>
                <h2>{isEditing ? "Edit" : "Add"} Event</h2>
                <form onSubmit={handleSubmit}>
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
                    <br />
                    <button type="submit">{isEditing ? "Update" : "Add"} Event</button>
                    <br />
                    {eventMessage && <span>{eventMessage}</span>}
                </form>
            </div>
        </div>
    );
};