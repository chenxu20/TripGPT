import React, { createContext, useEffect, useState } from 'react';
import { database } from '../config/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, getDocs, writeBatch } from 'firebase/firestore';

export const ItineraryContext = createContext();

export const ItineraryContextProvider = ({ children }) => {
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const itineraryCollection = collection(database, 'itineraries');

    useEffect(() => {
        const unsubscribe = onSnapshot(itineraryCollection, snapshot => {
            const itiData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItineraries(itiData);
            setLoading(false);
        }, error => {
            setError("Error: Failed to load itineraries.");
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const addItinerary = async name => {
        if (name.trim()) {
            try {
                await addDoc(itineraryCollection, { name, startDate: null, endDate: null });
                setError("");
            } catch (error) {
                setError("Error: Failed to add itinerary.");
            }
        } else {
            setError("Invalid itinerary name.");
        }
    };

    const deleteItinerary = async id => {
        try {
            const batch = writeBatch(database);
            const itineraryRef = doc(database, 'itineraries', id);
            const eventCollection = collection(itineraryRef, 'events');
            const eventsSnapshot = await getDocs(eventCollection);

            eventsSnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });

            batch.delete(itineraryRef);

            await batch.commit();
            setError("");
        } catch (error) {
            setError("Error: Failed to delete itinerary.");
        }
    };

    const addEventItem = async (itiId, event) => {
        if (event.name.trim()) {
            try {
                const eventCollection = collection(database, `itineraries/${itiId}/events`);
                await addDoc(eventCollection, event);
                setError("");
            } catch (error) {
                setError("Error: Failed to add event.");
            }
        } else {
            setError("Invalid event details.");
        }
    };

    const updateEventItem = async (itiId, eventId, event) => {
        if (event.name.trim()) {
            try {
                const eventRef = doc(database, `itineraries/${itiId}/events`, eventId);
                await updateDoc(eventRef, event);
                setError("");
            } catch (error) {
                setError("Error: Failed to update event.");
            }
        } else {
            setError("Invalid event details.");
        }
    };

    const removeEventItem = async (itiId, eventId) => {
        try {
            const eventRef = doc(database, `itineraries/${itiId}/events`, eventId);
            await deleteDoc(eventRef);
            setError("");
        } catch (error) {
            setError("Error: Failed to delete event.");
        }
    };

    return (
        <ItineraryContext.Provider value={{ itineraries, setItineraries, addItinerary, deleteItinerary, addEventItem, updateEventItem, removeEventItem, loading, error }}>
            {children}
        </ItineraryContext.Provider>
    );
};