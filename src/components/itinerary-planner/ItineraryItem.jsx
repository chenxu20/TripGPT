import React, { useEffect } from 'react';
import { doc, updateDoc, collection, onSnapshot } from 'firebase/firestore';
import { database } from '../../config/firebase';
import { Link } from 'react-router-dom';

export const ItineraryItem = ({ itinerary, deleteItinerary }) => {
    useEffect(() => {
        const eventsCollection = collection(database, `itineraries/${itinerary.id}/events`);
        const unsubscribe = onSnapshot(eventsCollection, async snapshot => {
            const events = snapshot.docs.map(doc => doc.data());
            if (events.length > 0) {
                const startDate = events.map(event => event.startDate)
                    .filter(Boolean)
                    .map(date => date.toDate())
                    .reduce((x, y) => x < y ? x : y);

                const endDate = events.map(event => event.endDate || event.startDate)
                    .filter(Boolean)
                    .map(date => date.toDate())
                    .reduce((x, y) => x > y ? x : y);

                await updateDoc(doc(database, 'itineraries', itinerary.id), { startDate, endDate });
            }
        });

        return () => unsubscribe();
    }, [itinerary.id]);

    function displayDate(date) {
        return date.toDate().toLocaleDateString("en-GB");
    }

    const handleDelete = () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete \"${itinerary.name}\"?`);
        if (confirmDelete) {
            deleteItinerary(itinerary.id);
        }
    }

    return (
        <li key={itinerary.id}>
            <Link to={`./${itinerary.id}`}>{itinerary.name}</Link>
            {itinerary.startDate && itinerary.endDate && 
                <div>{displayDate(itinerary.startDate)} – {displayDate(itinerary.endDate)}</div>}
            <button onClick={handleDelete}>Delete itinerary</button>
        </li>
    );
};