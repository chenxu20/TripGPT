import React, { createContext, useEffect, useState } from 'react';
import { database } from '../config/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, getDocs, writeBatch, query, where } from 'firebase/firestore';
import { UserAuth } from './AuthContext';

export const ItineraryContext = createContext();

export const ItineraryContextProvider = ({ children }) => {
    const { user } = UserAuth();
    const [upcomingItineraries, setUpcomingItineraries] = useState([]);
    const [pastItineraries, setPastItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const itineraryCollection = collection(database, 'itineraries');

    //Enum managing event type
    const eventTypes = {
        ACCOMMODATION: "accommodation",
        ACTIVITY: "activity",
        ATTRACTION: "attraction",
        FLIGHT: "flight",
        FOOD: "food",
        TRANSPORTATION: "transportation",
        NO_TYPE: ""
    };

    useEffect(() => {
        if (user) {
            const q = query(itineraryCollection, where("user", "==", user.uid));
            const unsubscribe = onSnapshot(q, snapshot => {
                const fetchedItineraries = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                const currentDate = new Date();
                const pastItineraries = fetchedItineraries.filter(iti => iti.endDate?.toDate() < currentDate);
                const futureItineraries = fetchedItineraries.filter(iti => iti.startDate?.toDate() >= currentDate);
                const undatedItineraries = fetchedItineraries.filter(iti => !iti.startDate);

                pastItineraries.sort((x, y) => y.endDate.toDate() - x.endDate.toDate());
                futureItineraries.sort((x, y) => x.startDate.toDate() - y.startDate.toDate());

                setUpcomingItineraries([...undatedItineraries, ...futureItineraries]);
                setPastItineraries(pastItineraries);
                setLoading(false);
            }, error => {
                setError("Error: Failed to load itineraries.");
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, [user]);

    const addItinerary = async name => {
        if (name.trim()) {
            try {
                await addDoc(itineraryCollection, { name, user: user.uid, startDate: null, endDate: null });
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
        <ItineraryContext.Provider value={{ upcomingItineraries, pastItineraries, addItinerary, deleteItinerary, addEventItem, updateEventItem, removeEventItem, loading, error, eventTypes }}>
            {children}
        </ItineraryContext.Provider>
    );
};