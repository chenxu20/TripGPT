import React, { useContext, useEffect } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { AddItineraryItem } from './AddItineraryItem';
import { database } from '../../config/firebase';
import { Link } from 'react-router-dom';

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
                <li key={iti.id}>
                    <Link to={`./${iti.id}`}>{iti.name}</Link>
                    <button onClick={() => deleteItinerary(iti.id)}>Delete itinerary</button>
                </li>
            ))}
            </ul>
        </div>
    );
};