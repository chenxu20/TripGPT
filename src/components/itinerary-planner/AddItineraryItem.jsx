import React, { useState, useContext, useEffect } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';

export const AddItineraryItem = () => {
    const { addItinerary, error } = useContext(ItineraryContext);
    const [itinerary, setItinerary] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        await addItinerary(itinerary);
        if (!error) {
            setMessage("Itinerary added successfully.");
            setItinerary('');
        }
        setLoading(false);
    };

    useEffect(() => {
        setMessage(error ?? "");
    }, [error]);

    return (
        <form onSubmit={handleSubmit} id="itinerary-add-form" autoComplete="off">
            <div>
                <input
                    type="text"
                    name="itineraryName"
                    value={itinerary}
                    onChange={e => setItinerary(e.target.value)}
                    placeholder="Itinerary name"
                    required
                    disabled={loading}
                />
                <button type="submit" className="itinerary-button" disabled={loading}>Add Itinerary</button>
            </div>
            {message && <span>{message}</span>}
        </form>
    );
};