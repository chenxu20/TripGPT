import React, { useState, useContext, useEffect } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';

export const AddItineraryItem = () => {
    const { addItinerary, error } = useContext(ItineraryContext);
    const [itinerary, setItinerary] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addItinerary(itinerary);
        setItinerary('');
        setMessage("Itinerary added successfully")
    };

    useEffect(() => {
        if (error) {
            setMessage(error);
        }
    }, [error]);

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={itinerary}
                onChange={(e) => setItinerary(e.target.value)}
                placeholder="Add Itinerary"
            />
            <button type="submit">Add Itinerary</button>
            {message && <span>{message}</span>}
        </form>
    );
};
