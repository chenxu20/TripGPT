import React, { useContext, useEffect } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { AddItineraryItem } from './AddItineraryItem';
import { database } from '../../config/firebase';
import { ItineraryItem } from './ItineraryItem';

export const ItineraryList = () => {
    const { itineraries, deleteItinerary, loading, error } = useContext(ItineraryContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <AddItineraryItem />
            <div className="itinerary-list-wrapper">
                {itineraries.length === 0 ? (
                    <div>No itineraries currently. Add one now!</div>
                ) : (
                    itineraries.map(iti => (
                        <ItineraryItem key={iti.id} itinerary={iti} deleteItinerary={deleteItinerary} />
                    ))
                )}
            </div>
        </div>
    );
};