import React, { useContext } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import { AddItineraryItem } from './AddItineraryItem';
import { ItineraryItem } from './ItineraryItem';
import { ClipLoader } from 'react-spinners';

export const ItineraryList = () => {
    const { upcomingItineraries, pastItineraries, loading, error } = useContext(ItineraryContext);

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
                            <ItineraryItem key={iti.id} itinerary={iti} />
                        ))
                    )}
                </div>
                <div className="itinerary-list-column">
                    <h2>Past Trips</h2>
                    {pastItineraries.length === 0 ? (
                        <div>No past trips found.</div>
                    ) : (
                        pastItineraries.map(iti => (
                            <ItineraryItem key={iti.id} itinerary={iti} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};