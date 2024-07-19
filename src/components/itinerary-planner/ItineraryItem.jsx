import React, { useContext, useEffect } from 'react';
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
    const { loading } = useContext(ItineraryContext);

    useEffect(() => {
        const eventsCollection = collection(database, `itineraries/${itinerary.id}/events`);
        const unsubscribe = onSnapshot(eventsCollection, async snapshot => {
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
        });

        return () => unsubscribe();
    }, [itinerary.id]);

    const handleDelete = () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete \"${itinerary.name}\"?`);
        if (confirmDelete) {
            deleteItinerary(itinerary.id);
        }
    };

    if (loading) {
        return <div><ClipLoader color="#ffffff" /></div>;
    }

    return (
        <div key={itinerary.id} className="itinerary-item">
            <div className="itinerary-title">{itinerary.name}</div>
            {itinerary.startDate && itinerary.endDate &&
                <div>{displayDate(itinerary.startDate)} – {displayDate(itinerary.endDate)}</div>}
            <div className="itinerary-item-buttons">
                <button className="itinerary-button" onClick={() => navigate(`./${itinerary.id}`)}>View Itinerary</button>
                <button className="itinerary-button" onClick={handleDelete}>Delete Itinerary</button>
            </div>
            <ShareItineraryItem itineraryId={itinerary.id} />
        </div>
    );
};