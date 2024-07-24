import React, { useContext, useEffect, useRef, useState } from 'react';
import { doc, updateDoc, collection, onSnapshot, query, where, getDocs, getDoc } from 'firebase/firestore';
import { database } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { ItineraryContext } from '../../context/ItineraryContext';
import { ClipLoader } from 'react-spinners';
import { ShareItineraryItem } from './ShareItineraryItem';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { Alert } from '../AlertMessage';

function displayDate(date) {
    return date.toDate().toLocaleDateString("en-GB");
}

export const ItineraryItem = ({ itinerary, setAlert }) => {
    const navigate = useNavigate();
    const { duplicateItinerary, deleteItinerary } = useContext(ItineraryContext);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [sharedUsers, setSharedUsers] = useState([]);
    const [owner, setOwner] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        let unsubscribeEvents;
        const fetchItinerary = async () => {
            setLoading(true);
            try {
                const eventsCollection = collection(database, `itineraries/${itinerary.id}/events`);
                const itineraryRef = doc(database, 'itineraries', itinerary.id);

                unsubscribeEvents = onSnapshot(eventsCollection, async snapshot => {
                    const events = snapshot.docs.map(doc => doc.data());
                    if (events.length > 0) {
                        const startDate = events
                            .map(event => event.startDate)
                            .filter(Boolean)
                            .map(date => date.toDate())
                            .reduce((x, y) => x < y ? x : y);

                        const endDate = events
                            .map(event => event.endDate || event.startDate)
                            .filter(Boolean)
                            .map(date => date.toDate())
                            .reduce((x, y) => x > y ? x : y);

                        await updateDoc(itineraryRef, { startDate, endDate });
                    } else {
                        await updateDoc(itineraryRef, { startDate: null, endDate: null });
                    }
                });

                const itineraryDoc = await getDoc(itineraryRef)
                const { user, sharedWith } = itineraryDoc.data();

                const userQuery = query(collection(database, "users"), where("uid", "==", user));
                const userSnapshot = await getDocs(userQuery);
                if (!userSnapshot.empty) {
                    setOwner(userSnapshot.docs[0].data());
                } else {
                    setOwner(null);
                }

                if (sharedWith.length > 0) {
                    const sharedWithQuery = query(collection(database, "users"), where("uid", "in", sharedWith));
                    const usersSnapshot = await getDocs(sharedWithQuery);
                    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setSharedUsers(users);
                } else {
                    setSharedUsers([]);
                }

                setErrorMessage("");
            } catch (error) {
                setErrorMessage("Failed to load itinerary data.");
                return;
            } finally {
                setLoading(false);
            }
        };
        fetchItinerary();

        return () => {
            unsubscribeEvents?.();
        };
    }, [itinerary.id]);

    useEffect(() => {
        const handleClickOutside = e => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${itinerary.name}"?`);
        if (confirmDelete) {
            try {
                await deleteItinerary(itinerary.id);
                setAlert(new Alert(`Deleted "${itinerary.name}" successfully.`, 5000, "success"));
                setShowDropdown(false);
            } catch (error) {
                setAlert(new Alert(error.message, 8000, "error"));
            }
        }
    };

    const handleDuplicate = async () => {
        try {
            await duplicateItinerary(itinerary.id);
            setAlert(new Alert(`Duplicated "${itinerary.name}".`, 5000, "success"));
            setShowDropdown(false);
        } catch (error) {
            setAlert(new Alert(error.message, 8000, "error"));
        }
    };

    function displaySharedUsers() {
        const maxNumber = 2;
        if (sharedUsers.length <= maxNumber) {
            return sharedUsers.map(user => user.name).join(', ');
        } else {
            const shownUsers = sharedUsers.slice(0, maxNumber).map(user => user.name).join(', ');
            const remainingUsers = sharedUsers.length - maxNumber;
            return `${shownUsers} +${remainingUsers}`;
        }
    }

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    if (loading) {
        return <div><ClipLoader color="#ffffff" /></div>;
    }

    return (
        <div key={itinerary.id} className="itinerary-item">
            {errorMessage ? <div className="error-message">{errorMessage}</div> :
                <>
                    <div className="itinerary-header">
                        <div className="itinerary-title">{itinerary.name}</div>
                        <div className="dropdown-wrapper" ref={dropdownRef}>
                            <button className="dropdown-button" onClick={toggleDropdown}><FaEllipsisVertical size="1.4rem" /></button>
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <ul>
                                        <li>
                                            <ShareItineraryItem itineraryId={itinerary.id} setAlert={setAlert} />
                                        </li>
                                        <li>
                                            <button className="dropdown-menu-button" onClick={handleDuplicate}>Duplicate</button>
                                        </li>
                                        <li>
                                            <button className="dropdown-menu-button" onClick={handleDelete}>Delete</button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>{itinerary.destination}</div>
                    <div className="itinerary-dates">
                        {itinerary.startDate && itinerary.endDate
                            ? `${displayDate(itinerary.startDate)} – ${displayDate(itinerary.endDate)}`
                            : "Undated"}
                    </div>
                    <div className="itinerary-item-bottom">
                        <div className="user-details">
                            <div>{owner ? `Owned by ${owner.name}` : "Loading owner..."}</div>
                            <div>{sharedUsers.length > 0 ? `Shared with ${displaySharedUsers()}` : "Private itinerary"}</div>
                        </div>
                        <div className="view-button">
                            <button className="itinerary-button view-button" onClick={() => navigate(`./${itinerary.id}`)}>View</button>
                        </div>
                    </div>
                </>
            }
        </div>
    );
    /*
        Future design:
        Discontinue view button, give functionality to title directly
        Add a subheading to determine destination
        Add a picture on the right side, move dropdown to left of picture
    */
};