import React, { useContext, useEffect, useState } from 'react';
import { doc, updateDoc, collection, onSnapshot } from 'firebase/firestore';
import { database } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { ItineraryContext } from '../../context/ItineraryContext';
import { ClipLoader } from 'react-spinners';
import { ShareItineraryItem } from './ShareItineraryItem';

function displayDate(date) {
    return date.toDate().toLocaleDateString("en-GB");
}

export const ItineraryItem = ({ itinerary, deleteItinerary }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setLoading(true);
        const eventsCollection = collection(database, `itineraries/${itinerary.id}/events`);
        const unsubscribe = onSnapshot(eventsCollection, async snapshot => {
            try {
                const events = snapshot.docs.map(doc => doc.data());
                if (events.length > 0) {
                    const startDate = events
                        .map(event => event.startDate)
                        .filter(Boolean)
                        .map(date => date.toDate())
                        .reduce((x, y) => x < y ? x : y);

                    const endDate = events
                        .map(event => event.endDate || event.startDate)
                        .filter(Boolean)
                        .map(date => date.toDate())
                        .reduce((x, y) => x > y ? x : y);

                    await updateDoc(doc(database, 'itineraries', itinerary.id), { startDate, endDate });
                } else {
                    await updateDoc(doc(database, 'itineraries', itinerary.id), { startDate: null, endDate: null });
                }
                setErrorMessage("");
            } catch (error) {
                setErrorMessage("Failed to update itinerary dates.");
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [itinerary.id]);

    const handleDelete = () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${itinerary.name}"?`);
        if (confirmDelete) {
            deleteItinerary(itinerary.id);
        }
    };

    if (loading) {
        return <div><ClipLoader color="#ffffff" /></div>;
    }

    return (
        <div key={itinerary.id} className="itinerary-item">
            {errorMessage ? <div className="error-message">{errorMessage}</div> :
                <>
                    <div className="itinerary-title">{itinerary.name}</div>
                    <div className="itinerary-dates">
                        {itinerary.startDate && itinerary.endDate
                            ? `${displayDate(itinerary.startDate)} – ${displayDate(itinerary.endDate)}`
                            : "Undated Trip"}
                    </div>
                    <button className="itinerary-button itinerary-view-button" onClick={() => navigate(`./${itinerary.id}`)}>View</button>
                    <ShareItineraryItem itineraryId={itinerary.id} />
                    <button className="itinerary-button itinerary-delete-button" onClick={handleDelete}>Delete</button>
                </>
            }
        </div>
    );
};