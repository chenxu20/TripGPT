import React, { useContext, useEffect } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { AddItineraryItem } from './AddItineraryItem';
import { database } from '../../config/firebase';
import { ItineraryItem } from './ItineraryItem';
import { ClipLoader } from 'react-spinners';

export const ItineraryList = () => {
    const { upcomingItineraries, pastItineraries, deleteItinerary, loading, error } = useContext(ItineraryContext);

    if (loading) {
        return <div><ClipLoader color="#ffffff" /></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <AddItineraryItem />
            <div className="itinerary-list-wrapper">
                <div className="itinerary-list-column">
                    <h2>Upcoming Trips</h2>
                    {upcomingItineraries.length === 0 ? (
                        <div>No upcoming trips found.</div>
                    ) : (
                        upcomingItineraries.map(iti => (
                            <ItineraryItem key={iti.id} itinerary={iti} deleteItinerary={deleteItinerary} />
                        ))
                    )}
                </div>
                <div className="itinerary-list-column">
                    <h2>Past Trips</h2>
                    {pastItineraries.length === 0 ? (
                        <div>No past trips found.</div>
                    ) : (
                        pastItineraries.map(iti => (
                            <ItineraryItem key={iti.id} itinerary={iti} deleteItinerary={deleteItinerary} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};