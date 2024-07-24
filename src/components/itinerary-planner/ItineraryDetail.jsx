import React, { useContext, useEffect, useRef, useState } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { AddEventItem } from './AddEventItem';
import { database } from '../../config/firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { AccommodationDetails } from './events/Accommodation';
import { ActivityDetails } from './events/Activity';
import { AttractionDetails } from './events/Attraction';
import { FlightDetails } from './events/Flight';
import { FoodDetails } from './events/Food';
import { TransportationDetails } from './events/Transportation';
import "./style.css";
import { FaChevronLeft } from 'react-icons/fa';
import { FaHotel, FaLocationDot, FaLandmark, FaPlane, FaUtensils, FaBus, FaCar, FaShip, FaTrainSubway } from 'react-icons/fa6';
import { ClipLoader } from 'react-spinners';
import { Alert, AlertMessage } from '../AlertMessage';

//Enum managing mode state.
const Mode = {
    VIEW: 'view',
    EDIT: 'edit'
};
Object.freeze(Mode);

export const ItineraryDetail = () => {
    const { id } = useParams();
    const { upcomingItineraries, pastItineraries, removeEventItem, eventTypes } = useContext(ItineraryContext);
    const [events, setEvents] = useState([]);
    const [itinerary, setItinerary] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [alert, setAlert] = useState(null);
    const [mode, setMode] = useState(Mode.VIEW);
    const [loading, setLoading] = useState(true);
    const timerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const itineraries = [...upcomingItineraries, ...pastItineraries];
        const currentItinerary = itineraries.find(iti => iti.id === id);
        if (currentItinerary) {
            setItinerary(currentItinerary);
        } else {
            setErrorMessage('Itinerary not found.');
            setLoading(false);
            return;
        }
        const eventsCollection = collection(database, `itineraries/${id}/events`);
        const unsubscribe = onSnapshot(eventsCollection, snapshot => {
            const fetchedEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const sortedEvents = fetchedEvents.sort((x, y) => x.startDate.toDate() - y.startDate.toDate());
            setEvents(sortedEvents);
            setLoading(false);
        }, error => {
            setErrorMessage("Failed to load events.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id, upcomingItineraries, pastItineraries]);

    function openAddEventModal() {
        setIsModalOpen(true);
    }

    function openEditEventModal(event) {
        setEventToEdit(event);
        setIsModalOpen(true);
    }

    function closeModal() {
        setErrorMessage("");
        setEventToEdit(null);
        setIsModalOpen(false);
    }

    const handleModeChange = e => {
        setMode(e.target.value);
    };

    const handleRemoveEvent = async (itiId, eventId) => {
        try {
            await removeEventItem(itiId, eventId);
            setAlert(new Alert("Event removed successfully", 5000, "success"));
        } catch (error) {
            setAlert(new Alert(error.message, 8000, "error"));
        }
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
            case eventTypes.ATTRACTION:
                return <AttractionDetails event={event} displayDateTime={displayDateTime} />;
            case eventTypes.FLIGHT:
                return <FlightDetails event={event} displayDateTime={displayDateTime} />;
            case eventTypes.FOOD:
                return <FoodDetails event={event} displayDateTime={displayDateTime} />;
            case eventTypes.TRANSPORTATION:
                return <TransportationDetails event={event} displayDateTime={displayDateTime} />;
            default:
                return <div>Error: Bad event type.</div>;
        }
    };

    function getEventTypeIcon(event) {
        switch (event.type) {
            case eventTypes.ACCOMMODATION:
                return <FaHotel />;
            case eventTypes.ACTIVITY:
                return <FaLocationDot />;
            case eventTypes.ATTRACTION:
                return <FaLandmark />;
            case eventTypes.FLIGHT:
                return <FaPlane />;
            case eventTypes.FOOD:
                return <FaUtensils />;
            case eventTypes.TRANSPORTATION:
                switch (event.name) {
                    case "bus":
                        return <FaBus />;
                    case "car":
                        return <FaCar />;
                    case "ferry":
                        return <FaShip />;
                    case "train":
                        return <FaTrainSubway />;
                    default:
                        return "";
                }
            default:
                return "";
        }
    }

    if (loading) {
        return <div><ClipLoader color="#ffffff" /></div>;
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    return (
        <div className="event-list-wrapper">
            <AlertMessage alert={alert} setAlert={setAlert} />
            <button onClick={() => navigate("/trips")} className="event-back-button"><FaChevronLeft />Trips</button>
            <div className="event-list-header">
                <h1 className="event-list-title">{itinerary?.name}</h1>
                <h2>{itinerary?.destination}</h2>
                <div className="mode-wrapper">
                    <select value={mode} onChange={handleModeChange} className="drop-down" id="itinerary-mode-toggle">
                        <option value={Mode.VIEW}>Viewing</option>
                        <option value={Mode.EDIT}>Editing</option>
                    </select>
                    {mode === Mode.EDIT && (
                        <>
                            <button onClick={openAddEventModal} className="itinerary-button">Add Event</button>
                            <AddEventItem
                                itiId={id}
                                isOpen={isModalOpen}
                                closeModal={closeModal}
                                eventToEdit={eventToEdit}
                                setAlert={setAlert}
                            />
                        </>
                    )}
                </div>
            </div>
            <ul className="event-display">
                {events.map(event => (
                    <li key={event.id} className="event-wrapper">
                        <div className="event-timeline">
                            <div className="event-icon">
                                {getEventTypeIcon(event)}
                            </div>
                            <div className="timeline-line"></div>
                        </div>
                        <div className="event-content-wrapper">
                            <div className="event-content">
                                {renderEventDetails(event)}
                            </div>
                            {mode === Mode.EDIT && (
                                <div className="event-content-button">
                                    <button onClick={() => openEditEventModal(event)} className="itinerary-button">Edit</button>
                                    <button onClick={() => handleRemoveEvent(id, event.id)} className="itinerary-button">Remove</button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};