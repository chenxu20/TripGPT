import React, { useState, useContext, useEffect } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import { Alert } from '../AlertMessage';

export const AddItineraryItem = ({ setAlert }) => {
    const { addItinerary } = useContext(ItineraryContext);
    const [itineraryName, setItineraryName] = useState("");
    const [destination, setDestination] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        try {
            await addItinerary(itineraryName, destination);
            setItineraryName("");
            setDestination("")
            setAlert(new Alert("Itinerary added successfully.", 5000, "success"));
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setErrorMessage("");
        setIsModalOpen(false);
    }

    return (
        <>
            <button onClick={openModal} className="itinerary-button">Add Itinerary</button>
            {isModalOpen && (
                <div className="itinerary-modal">
                    <div className="itinerary-modal-overlay" onClick={closeModal}></div>
                    <div className="itinerary-modal-content">
                        <button className="itinerary-modal-close-button" onClick={closeModal}>X</button>
                        <h2>Add Itinerary</h2>
                        <form onSubmit={handleSubmit} id="itinerary-add-form" autoComplete="off">
                            <label>
                                Name
                                <input
                                    type="text"
                                    name="itineraryName"
                                    value={itineraryName}
                                    onChange={e => setItineraryName(e.target.value)}
                                    placeholder="Itinerary name"
                                    required
                                    disabled={loading}
                                />
                            </label>
                            <label>
                                Destination
                                <input
                                    type="text"
                                    name="destination"
                                    value={destination}
                                    onChange={e => setDestination(e.target.value)}
                                    placeholder="Destination"
                                    required
                                    disabled={loading}
                                />
                            </label>
                            <button type="submit" className="itinerary-button" disabled={loading}>
                                {loading ? "Adding..." : "Add Itinerary"}
                            </button>
                            {errorMessage && <span>{errorMessage}</span>}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};