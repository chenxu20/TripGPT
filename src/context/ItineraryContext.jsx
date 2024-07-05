import React, { createContext, useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';

export const ItineraryContext = createContext();

export const ItineraryContextProvider = ({ children }) => {
    const [itinerary, setItinerary] = useState([]);
    const itineraryCollection = collection(database, 'itinerary');

    useEffect(() => {
        const fetchItineraries = async () => {
            const querySnapshot = await getDocs(itineraryCollection);
            const itinData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItinerary(itinData);
        };
        fetchItineraries();
    }, []);

    const addItinerary = async (itinerary) => {
        if (itinerary.trim()) {
            const docRef = await addDoc(collection(database, 'itinerary'), {
                name: itinerary,
            });
            setItinerary([...itinerary, { id: docRef.id, name: itinerary }]);
        }
    };

    const deleteItinerary = async id => {
        await deleteDoc(doc(database, 'itinerary', id));
        setItinerary(itinerary.filter(iti => iti.id !== id));
    };

    const addEventItem = async (itiId, event) => {
        if (event.trim()) {
            const docRef = await addDoc(collection(database, `itinerary/${itiId}/events`), {
                name: event,
            });
            setItinerary(itinerary.map(iti => {
                if (iti.id === itiId) {
                    const updatedEvents = [...(iti.events || []), { id: docRef.id, name: event }];
                    return { ...iti, events: updatedEvents };
                }
                return iti;
            }));
        }
    };

    const removeEventItem = async (itiId, eventId) => {
        const eventRef = doc(database, `itinerary/${itiId}/events`, eventId);
        await deleteDoc(eventRef);
        setItinerary(itinerary.map(iti => iti.id === itiId ? {
            ...iti,
            events: iti.events.filter(event => event.id !== eventId)
        } : iti));
    };

    return (
        <ItineraryContext.Provider value={{ itinerary, addItinerary, deleteItinerary, addEventItem, removeEventItem }}>
            {children}
        </ItineraryContext.Provider>
    );
};