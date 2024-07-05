import React, { useState, useContext } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';

export const AddEventItem = ({ itiId }) => {
    const { addEventItem } = useContext(ItineraryContext);
    const [event, setEvent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addEventItem(itiId, event);
        setEvent('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                placeholder="Add new event"
            />
            <button type="submit">Add Event</button>
        </form>
    );
};