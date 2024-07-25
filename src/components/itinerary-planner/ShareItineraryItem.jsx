import React, { useContext, useState } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import { Alert } from '../AlertMessage';
import "./style.css";

const Modes = {
    EMAIL: "email",
    LINK: "link"
}

export const ShareItineraryItem = ({ itineraryId, setAlert }) => {
    const { shareItinerary } = useContext(ItineraryContext);
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState(Modes.EMAIL);

    const handleShare = async e => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        try {
            await shareItinerary(itineraryId, email);
            setEmail("");
            setAlert(new Alert(`Shared with ${email} successfully.`, 5000, "success"));
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
        setEmail("");
        setIsModalOpen(false);
    }

    const handleModeChange = e => {
        setMode(e.target.value);
        setEmail("");
        setErrorMessage("");
    }

    return (
        <>
            <button onClick={openModal} className="dropdown-menu-button">Share</button>
            {isModalOpen && (
                <div className="itinerary-modal">
                    <div className="itinerary-modal-overlay" onClick={closeModal}></div>
                    <div className="itinerary-modal-content">
                        <button className="itinerary-modal-close-button" onClick={closeModal}>X</button>
                        <h2>Share Itinerary</h2>
                        <div className="share-mode-selector">
                            <input
                                type="radio"
                                id="share-email"
                                name="shareMode"
                                value="email"
                                checked={mode === Modes.EMAIL}
                                onChange={handleModeChange}
                            />
                            <label htmlFor="share-email">Share via Email</label>
                            <input
                                type="radio"
                                id="share-link"
                                name="shareMode"
                                value="link"
                                checked={mode === Modes.LINK}
                                onChange={handleModeChange}
                            />
                            <label htmlFor="share-link">Share via Link</label>
                        </div>
                        {mode === Modes.EMAIL &&
                            <form id="itinerary-share-form" onSubmit={handleShare}>
                                <label>
                                    User email
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="Email"
                                        required
                                    />
                                </label>
                                {errorMessage && <span>{errorMessage}</span>}
                                <button type="submit" className="itinerary-button" disabled={loading}>Share Itinerary</button>
                            </form>
                        }
                        {mode === Modes.LINK &&
                            <div>Coming soon</div>
                        }
                    </div>
                </div>
            )}
        </>
    );
};