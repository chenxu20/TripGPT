import React, { useContext, useEffect, useState } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { AddEventItem } from './AddEventItem';
import { database } from '../../config/firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { AccommodationDetails } from './events/Accommodation';
import { ActivityDetails } from './events/Activity';
import { FlightDetails } from './events/Flight';
import "./style.css";

//Enum which manages mode state.
const Mode = {
    VIEW: 'view',
    EDIT: 'edit'
};
Object.freeze(Mode);

export const ItineraryDetail = () => {
    const { id } = useParams();
    const { itineraries, removeEventItem, eventTypes } = useContext(ItineraryContext);
    const [events, setEvents] = useState([]);
    const [itinerary, setItinerary] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [eventMessage, setEventMessage] = useState('');
    const [mode, setMode] = useState(Mode.VIEW);
    const navigate = useNavigate();

    useEffect(() => {
        const currentItinerary = itineraries.find(iti => iti.id === id);
        if (currentItinerary) {
            setItinerary(currentItinerary);
        }
        const eventsCollection = collection(database, `itineraries/${id}/events`);
        const unsubscribe = onSnapshot(eventsCollection, snapshot => {
            const fetchedEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const sortedEvents = fetchedEvents.sort((x, y) => x.startDate.toDate() - y.startDate.toDate());
            setEvents(sortedEvents);
        });

        return () => unsubscribe();
    }, [id, itineraries]);

    function openAddEventModal() {
        setModalIsOpen(true);
        document.body.classList.add('active-modal');
    }

    function openEditEventModal(event) {
        setEventToEdit(event);
        setModalIsOpen(true);
        document.body.classList.add('active-modal');
    }

    function closeModal() {
        setEventMessage('');
        setEventToEdit(null);
        setModalIsOpen(false);
        document.body.classList.remove('active-modal');
    }

    const handleModeChange = e => {
        setMode(e.target.value);
    };

    function displayDateTime(date) {
        return date.toDate().toLocaleString("en-GB");
    }

    const renderEventDetails = event => {
        switch (event.type) {
            case eventTypes.ACCOMMODATION:
                return <AccommodationDetails event={event} displayDateTime={displayDateTime} />;
            case eventTypes.ACTIVITY:
                return <ActivityDetails event={event} displayDateTime={displayDateTime} />;
            case eventTypes.FLIGHT:
                return <FlightDetails event={event} displayDateTime={displayDateTime} />;
            default:
                return <div>Error: Bad event type.</div>;
        }
    };

    return (
        <div>
            <button onClick={() => navigate("/trips")}>Back</button>
            <h1>{itinerary.name}</h1>
            <select value={mode} onChange={handleModeChange}>
                <option value={Mode.VIEW}>Viewing</option>
                <option value={Mode.EDIT}>Editing</option>
            </select>
            <br />
            {mode === Mode.EDIT && (
                <>
                    <button onClick={openAddEventModal}>Add Event</button>
                    <AddEventItem
                        itiId={id}
                        isOpen={modalIsOpen}
                        closeModal={closeModal}
                        eventToEdit={eventToEdit}
                        eventMessage={eventMessage}
                        setEventMessage={setEventMessage}
                    />
                </>
            )}
            <ul>
                {events.map(event => (
                    <li key={event.id}>
                        {renderEventDetails(event)}
                        {mode === Mode.EDIT && (
                            <>
                                <button onClick={() => openEditEventModal(event)}>Edit Event</button>
                                <button onClick={() => removeEventItem(id, event.id)}>Remove Event</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}