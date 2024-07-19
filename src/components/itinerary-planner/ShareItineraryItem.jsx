import React, { useContext, useEffect, useState } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';

export const ShareItineraryItem = ({ itineraryId }) => {
    const { shareItinerary, loading, error } = useContext(ItineraryContext);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage(error ?? "");
    }, [error]);

    const handleShare = async e => {
        e.preventDefault();
        await shareItinerary(itineraryId, email);
        setEmail('');
    };

    return (
        <form onSubmit={handleShare}>
            <label>
                Email
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="User email"
                />
            </label>
            <button type="submit">Share Itinerary</button>
            {message && <span>{message}</span>}
        </form>
    );
};