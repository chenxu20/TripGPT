import React, { useContext, useEffect, useState } from 'react';
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
import { FaChevronLeft } from 'react-icons/fa';
import { FaHotel, FaLocationDot, FaLandmark, FaPlane, FaUtensils, FaBus, FaCar, FaShip, FaTrainSubway, FaRegTrashCan } from 'react-icons/fa6';
import { ClipLoader } from 'react-spinners';
import { Alert, AlertMessage } from '../AlertMessage';
import "./style.css";

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
    const [errorMessage, setErrorMessage] = useState('');
    const [alert, setAlert] = useState(null);
    const [mode, setMode] = useState(Mode.VIEW);
    const [loading, setLoading] = useState(true);
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

    const renderEvents = () => {
        let prevDate = null;

        return events.map(event => {
            const eventDate = event.startDate.toDate();
            const eventDateString = eventDate.toLocaleDateString("en-GB");

            const eventEndDateObj = event.endDate;
            const isDateDifferent = eventEndDateObj &&
                eventDateString !== eventEndDateObj.toDate().toLocaleDateString("en-GB");

            const showDateBar = prevDate !== eventDateString;
            prevDate = eventDateString;

            return (
                <React.Fragment key={event.id}>
                    {showDateBar && (
                        <div className="event-date-bar">
                            {eventDate.toLocaleDateString("en-GB", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    )}
                    <li key={event.id} className="event-wrapper">
                        <div className={`event-time-wrapper ${!eventEndDateObj && "event-time-wrapper-padding"}`}>
                            <div>
                                {eventDate.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            {eventEndDateObj && (
                                <>
                                    <div>&ndash;</div>
                                    {isDateDifferent &&
                                        <div>
                                            {eventEndDateObj.toDate().toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                        </div>
                                    }
                                    <div>
                                        {eventEndDateObj.toDate().toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="event-timeline-wrapper">
                            <div className="timeline-line-before"></div>
                            <div className="event-icon">
                                {getEventTypeIcon(event)}
                            </div>
                            <div className="timeline-line-after"></div>
                        </div>
                        <div className="event-content-wrapper">
                            <div className="event-content">
                                {renderEventDetails(event)}
                            </div>
                            {mode === Mode.EDIT && (
                                <div className="event-content-buttons">
                                    <AddEventItem
                                        itiId={id}
                                        eventToEdit={event}
                                        setAlert={setAlert}
                                    />
                                    <button onClick={() => handleRemoveEvent(id, event.id)} className="event-item-button" id="event-item-delete"><FaRegTrashCan size="1.1rem" /></button>
                                </div>
                            )}
                        </div>
                    </li>
                </React.Fragment>
            );
        });
    };

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


    const eventTypeIcons = {
        [eventTypes.ACCOMMODATION]: <FaHotel />,
        [eventTypes.ACTIVITY]: <FaLocationDot />,
        [eventTypes.ATTRACTION]: <FaLandmark />,
        [eventTypes.FLIGHT]: <FaPlane />,
        [eventTypes.FOOD]: <FaUtensils />,
        [eventTypes.TRANSPORTATION]: {
            bus: <FaBus />,
            car: <FaCar />,
            ferry: <FaShip />,
            train: <FaTrainSubway />,
        }
    };

    function getEventTypeIcon(event) {
        if (event.type === eventTypes.TRANSPORTATION) {
            return eventTypeIcons[event.type][event.name] || "";
        }
        return eventTypeIcons[event.type] || "";
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
                <div className="event-list-title">{itinerary?.name}</div>
                <div className="event-list-destination">{itinerary?.destination}</div>
                <div className="mode-wrapper">
                    <select value={mode} onChange={handleModeChange} className="drop-down" id="itinerary-mode-toggle">
                        <option value={Mode.VIEW}>Viewing</option>
                        <option value={Mode.EDIT}>Editing</option>
                    </select>
                    {mode === Mode.EDIT && (
                        <>
                            <AddEventItem
                                itiId={id}
                                eventToEdit={null}
                                setAlert={setAlert}
                            />
                        </>
                    )}
                </div>
            </div>
            <ul className="event-display">
                {renderEvents()}
            </ul>
        </div>
    );
};