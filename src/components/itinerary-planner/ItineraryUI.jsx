import React, { useContext, useEffect, useState } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { AddEventItem } from './AddEventItem';
import { AddItineraryItem } from './AddItineraryItem';
import { database } from '../../config/firebase';

export const ItineraryUI = () => {
    const { itinerary, deleteItinerary, removeEventItem } = useContext(ItineraryContext);
    const [events, setEvents] = useState({});

    useEffect(() => {
        if (itinerary.length > 0) {
            const unsubscribeList = itinerary.map(iti => {
                const eventsCollection = collection(database, `itinerary/${iti.id}/events`);
                return onSnapshot(eventsCollection, (snapshot) => {
                    setEvents(prevEvents => ({
                        ...prevEvents,
                        [iti.id]: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                    }));
                });
            });

            return () => {
                unsubscribeList.forEach(unsubscribe => unsubscribe());
            };
        }
    }, [itinerary]);

    return (
        <div>
            <AddItineraryItem />
            {itinerary.map(iti => (
                <div key={iti.id}>
                    <h2>{iti.name} <button onClick={() => deleteItinerary(iti.id)}>Delete itinerary</button></h2>
                    <AddEventItem itiId={iti.id} />
                    <ul>
                        {events[iti.id]?.map(event => (
                            <li key={event.id}>
                                {event.name}
                                <button onClick={() => removeEventItem(iti.id, event.id)}>Remove Event</button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};