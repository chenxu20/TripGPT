import React, { useState, useContext, useEffect } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';

export const AddItineraryItem = () => {
    const { addItinerary } = useContext(ItineraryContext);
    const [itinerary, setItinerary] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        try {
            await addItinerary(itinerary);
            setItinerary('');
            // setMessage("Itinerary added successfully.");
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

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
                <button type="submit" className="itinerary-button" disabled={loading}>
                    {loading ? "Adding..." : "Add Itinerary"}
                </button>
            </div>
            {errorMessage && <span>{errorMessage}</span>}
        </form>
    );
};