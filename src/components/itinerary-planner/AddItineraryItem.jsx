import React, { useState, useContext, useEffect } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import { Alert } from '../AlertMessage';
import "./style.css";

export const AddItineraryItem = ({ itineraryToEdit, setAlert }) => {
    const { addItinerary, updateItinerary } = useContext(ItineraryContext);
    const [itineraryName, setItineraryName] = useState("");
    const [destination, setDestination] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setItineraryName(itineraryToEdit?.name || "");
        setDestination(itineraryToEdit?.destination || "");
    }, [isModalOpen, itineraryToEdit]);

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        try {
            if (itineraryToEdit) {
                await updateItinerary(itineraryToEdit.id, itineraryName, destination);
                setAlert(new Alert("Itinerary updated successfully.", 5000, "success"));
            } else {
                await addItinerary(itineraryName, destination);
                setItineraryName("");
                setDestination("");
                closeModal();
                setAlert(new Alert("Itinerary added successfully.", 5000, "success"));
            }
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
            {itineraryToEdit
                ? <button onClick={openModal} className="dropdown-menu-button">Edit</button>
                : <button onClick={openModal} className="itinerary-button">Add Itinerary</button>
            }
            {isModalOpen && (
                <div className="itinerary-modal">
                    <div className="itinerary-modal-overlay" onClick={closeModal}></div>
                    <div className="itinerary-modal-content">
                        <button className="itinerary-modal-close-button" onClick={closeModal}>&#10006;</button>
                        <h2>{itineraryToEdit ? "Edit" : "Add"} Itinerary</h2>
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
                                    maxLength={40}
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
                                    maxLength={80}
                                />
                            </label>
                            {errorMessage && <span>{errorMessage}</span>}
                            <button type="submit" className="itinerary-button" disabled={loading}>
                                {itineraryToEdit
                                    ? loading ? "Editing..." : "Edit Itinerary"
                                    : loading ? "Adding..." : "Add Itinerary"
                                }
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};