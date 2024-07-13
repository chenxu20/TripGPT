import React, { useContext, useEffect } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { AddItineraryItem } from './AddItineraryItem';
import { database } from '../../config/firebase';
import { ItineraryItem } from './ItineraryItem';

export const ItineraryList = () => {
    const { itineraries, setItineraries, deleteItinerary } = useContext(ItineraryContext);

    useEffect(() => {
        const unsub = onSnapshot(collection(database, 'itineraries'), snapshot => {
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));

            const currentDate = new Date();
            const pastItineraries = data.filter(iti => iti.endDate.toDate() < currentDate);
            const futureItineraries = data.filter(iti => iti.startDate.toDate() >= currentDate);

            pastItineraries.sort((x, y) => y.endDate.toDate() - x.endDate.toDate());
            futureItineraries.sort((x, y) => x.startDate.toDate() - y.startDate.toDate());

            const sortedItineraries = [...futureItineraries, ...pastItineraries];

            setItineraries(sortedItineraries);
        });
        return () => unsub();
    }, [setItineraries]);

    return (
        <div>
            <AddItineraryItem />
            <ul>
                {itineraries.map(iti => (
                    <ItineraryItem key={iti.id} itinerary={iti} deleteItinerary={deleteItinerary} />
                ))}
            </ul>
        </div>
    );
};