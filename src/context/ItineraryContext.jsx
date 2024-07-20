import React, { createContext, useContext, useEffect, useState } from 'react';
import { database } from '../config/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, getDocs, writeBatch, query, where, or, arrayUnion, getDoc } from 'firebase/firestore';
import { AuthContext } from './AuthContext';

export const ItineraryContext = createContext();

export const ItineraryContextProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [upcomingItineraries, setUpcomingItineraries] = useState([]);
    const [pastItineraries, setPastItineraries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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
        setLoading(true);
        if (user) {
            const q = query(itineraryCollection,
                or(where("user", "==", user.uid),
                    where("sharedWith", "array-contains", user.uid))
            );
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
            await addDoc(itineraryCollection, { name, user: user.uid, startDate: null, endDate: null, sharedWith: [] });
        } else {
            throw new Error("Invalid itinerary name.");
        }
    };

    const deleteItinerary = async itiId => {
        const itineraryRef = doc(database, 'itineraries', itiId);
        const itineraryDoc = await getDoc(itineraryRef);
        if (itineraryDoc.exists && itineraryDoc.data().user !== user.uid) {
            throw new Error("Only the owner can delete the itinerary.");
        }

        const batch = writeBatch(database);
        const eventCollection = collection(itineraryRef, 'events');
        const eventsSnapshot = await getDocs(eventCollection);

        eventsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        batch.delete(itineraryRef);

        await batch.commit();
    }

    const shareItinerary = async (itiId, email) => {
        const usersRef = collection(database, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error("No user with this email.");
        }

        const userId = querySnapshot.docs[0].id;
        const itineraryRef = doc(database, "itineraries", itiId);
        await updateDoc(itineraryRef, {
            sharedWith: arrayUnion(userId)
        });
    };

    const addEventItem = async (itiId, event) => {
        if (event.name.trim()) {
            const eventCollection = collection(database, `itineraries/${itiId}/events`);
            await addDoc(eventCollection, event);
        } else {
            throw new Error("Invalid event details.");
        }
    };

    const updateEventItem = async (itiId, eventId, event) => {
        if (event.name.trim()) {
            const eventRef = doc(database, `itineraries/${itiId}/events`, eventId);
            await updateDoc(eventRef, event);
        } else {
            throw new Error("Invalid event details.");
        }
    };

    const removeEventItem = async (itiId, eventId) => {
        const eventRef = doc(database, `itineraries/${itiId}/events`, eventId);
        await deleteDoc(eventRef);
    };

    return (
        <ItineraryContext.Provider value={{
            upcomingItineraries, pastItineraries,
            addItinerary, deleteItinerary, shareItinerary,
            addEventItem, updateEventItem, removeEventItem,
            eventTypes, loading, error
        }}>
            {children}
        </ItineraryContext.Provider>
    );
};