import React, { useContext, useEffect, useState } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { AddItineraryItem } from './AddItineraryItem';
import { database } from '../../config/firebase';
import { ItineraryItem } from './ItineraryItem';

export const ItineraryList = () => {
    const { itineraries, setItineraries, deleteItinerary } = useContext(ItineraryContext);

    useEffect(() => {
        const unsub = onSnapshot(collection(database, 'itineraries'), (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setItineraries(data);
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