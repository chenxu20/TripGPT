import React, { useState, useContext, useEffect } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';

export const AddItineraryItem = () => {
    const { addItinerary, error } = useContext(ItineraryContext);
    const [itinerary, setItinerary] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        await addItinerary(itinerary);
        if (!error) {
            setMessage("Itinerary added successfully.");
            setItinerary('');
        }
    };

    useEffect(() => {
        if (error) {
            setMessage(error);
        }
    }, [error]);

    return (
        <form onSubmit={handleSubmit} className="itinerary-add-form">
            <div>
                <input
                    type="text"
                    value={itinerary}
                    onChange={(e) => setItinerary(e.target.value)}
                    placeholder="Itinerary name"
                    required
                />
                <button type="submit" className="itinerary-button">Add Itinerary</button>
            </div>
            {message && <span>{message}</span>}
        </form>
    );
};
