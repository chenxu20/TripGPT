import React, { useContext, useEffect, useState } from 'react';
import { ItineraryContext } from '../../context/ItineraryContext';
import { Alert } from '../AlertMessage';
import { arrayRemove, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { database } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import "./style.css";

const Modes = {
    EMAIL: "email",
    LINK: "link"
}

export const ShareItineraryItem = ({ itineraryId, setAlert }) => {
    const { shareItinerary } = useContext(ItineraryContext);
    const { user } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState(Modes.EMAIL);
    const [sharedUsers, setSharedUsers] = useState([]);
    const [owner, setOwner] = useState(null);

    const fetchUserDetails = async userIds => {
        if (userIds.length === 0) {
            return [];
        }
        const q = query(collection(database, "users"), where("uid", "in", userIds));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => doc.data());
        return users;
    };

    useEffect(() => {
        if (isModalOpen) {
            const itineraryDoc = doc(database, "itineraries", itineraryId);
            const unsubscribe = onSnapshot(itineraryDoc, async doc => {
                if (doc.exists()) {
                    const data = doc.data();

                    const ownerDetails = await fetchUserDetails([data.user]);
                    setOwner(ownerDetails[0]);

                    const users = data.sharedWith || [];
                    const userDetails = await fetchUserDetails(users);
                    setSharedUsers(userDetails);
                }
            });

            return () => unsubscribe();
        } else {
            setSharedUsers([]);
            setOwner(null);
        }
    }, [isModalOpen, itineraryId]);

    const handleShare = async e => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            if (email === user.email) {
                throw new Error("You already have access.");
            }

            const userAlreadyHasAccess = sharedUsers.some(user => user.email === email);
            if (userAlreadyHasAccess) {
                throw new Error("This user already has access.");
            }

            await shareItinerary(itineraryId, email);
            setEmail("");
            setAlert(new Alert(`Shared with ${email} successfully.`, 5000, "success"));
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const removeUser = async (userId, email) => {
        setLoading(true);
        setErrorMessage("");
        if (userId === user.uid && !window.confirm("Are you sure you want to remove your own access?")) {
            setLoading(false);
            return;
        }

        try {
            const itineraryRef = doc(database, "itineraries", itineraryId);
            await updateDoc(itineraryRef, {
                sharedWith: arrayRemove(userId)
            });
            setSharedUsers(sharedUsers.filter(user => user.uid !== userId));
            setAlert(new Alert(`Removed access for ${email}.`, 5000, "success"));
        } catch (error) {
            setAlert(new Alert(error.message, 8000, "error"));
        } finally {
            setLoading(false);
        }
    }

    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setErrorMessage("");
        setEmail("");
        setIsModalOpen(false);
    }

    const handleModeChange = e => {
        setMode(e.target.value);
        setEmail("");
        setErrorMessage("");
    }

    return (
        <>
            <button onClick={openModal} className="dropdown-menu-button">Share</button>
            {isModalOpen && (
                <div className="itinerary-modal">
                    <div className="itinerary-modal-overlay" onClick={closeModal}></div>
                    <div className="itinerary-modal-content">
                        <button className="itinerary-modal-close-button" onClick={closeModal}>X</button>
                        <h2>Share Itinerary</h2>
                        <div className="itinerary-share-section">
                            <div className="share-mode-selector">
                                <input
                                    type="radio"
                                    id="share-email"
                                    name="shareMode"
                                    value="email"
                                    checked={mode === Modes.EMAIL}
                                    onChange={handleModeChange}
                                />
                                <label htmlFor="share-email">Share via Email</label>
                                <input
                                    type="radio"
                                    id="share-link"
                                    name="shareMode"
                                    value="link"
                                    checked={mode === Modes.LINK}
                                    onChange={handleModeChange}
                                />
                                <label htmlFor="share-link">Share via Link</label>
                            </div>
                            {mode === Modes.EMAIL &&
                                <form id="itinerary-share-form" onSubmit={handleShare}>
                                    <label>
                                        User email
                                        <input
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="Email"
                                            required
                                        />
                                    </label>
                                    {errorMessage && <span>{errorMessage}</span>}
                                    <button type="submit" className="itinerary-button" disabled={loading}>Share Itinerary</button>
                                </form>
                            }
                            {mode === Modes.LINK &&
                                <div>Coming soon</div>
                            }
                        </div>
                        <hr />
                        <div className="itinerary-share-section">
                            <h3>Users with access</h3>
                            <ul id="share-user-list">
                                {owner && (
                                    <li key={owner.uid}>
                                        <div className="share-user-info">
                                            <div className="share-user-name">{owner.name}</div>
                                            <div className="share-user-email">{owner.email}</div>
                                        </div>
                                        <div>Owner</div>
                                    </li>
                                )}
                                {sharedUsers.map(user => (
                                    <li key={user.uid}>
                                        <div className="share-user-info">
                                            <div className="share-user-name">{user.name}</div>
                                            <div className="share-user-email">{user.email}</div>
                                        </div>
                                        <div>
                                            <button onClick={() => removeUser(user.uid, user.email)} disabled={loading} className="itinerary-button">Remove</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};