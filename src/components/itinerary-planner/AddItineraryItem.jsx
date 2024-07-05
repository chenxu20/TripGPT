import React, { useState, useContext } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';

export const AddItineraryItem = () => {
    const { addItinerary } = useContext(ItineraryContext);
    const [itinerary, setItinerary] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addItinerary(itinerary);
        setItinerary('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={itinerary}
                onChange={(e) => setItinerary(e.target.value)}
                placeholder="Add Itinerary"
            />
            <button type="submit">Add Itinerary</button>
        </form>
    );
};
