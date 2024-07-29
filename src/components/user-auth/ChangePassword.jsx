import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Alert } from '../AlertMessage';
import './style.css';

export const ChangePasswordModal = ({ isModalOpen, closeModal, changePassword, setAlert }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrorMessage("");
        setShowCurrentPassword(false);
        setShowNewPassword(false);
    }, [isModalOpen]);

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            if (newPassword !== confirmPassword) {
                throw new Error("Passwords do not match.");
            }
            await changePassword(currentPassword, newPassword);
            closeModal();
            setAlert(new Alert("Password changed successfully.", 5000, "success"));
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return isModalOpen && (
        <div className="account-modal">
            <div className="account-modal-overlay" onClick={closeModal}></div>
            <div className="account-modal-content">
                <span className="account-modal-close-button" onClick={closeModal}>&#10006;</span>
                <h2>Change Password</h2>
                <fieldset disabled={loading} className={`change-password-fieldset ${loading && 'change-password-fieldset-disabled'}`}>
                    <form id="change-password-form" onSubmit={handleSubmit} autoComplete="off">
                        <label>
                            Current password
                            <div className="change-password-field">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    placeholder="Current password"
                                    required
                                />
                                <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="show-password-icon" type="button">
                                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </label>
                        <label>
                            New password
                            <div className="change-password-field">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="New password"
                                    required
                                />
                                <button onClick={() => setShowNewPassword(!showNewPassword)} className="show-password-icon" type="button">
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </label>
                        <label>
                            Confirm password
                            <div className="change-password-field">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm password"
                                    required
                                />
                                <button onClick={() => setShowNewPassword(!showNewPassword)} className="show-password-icon" type="button">
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </label>
                        {errorMessage && <span>{errorMessage}</span>}
                        <button type="submit" className="account-button">Change Password</button>
                    </form>
                </fieldset>
            </div>
        </div>
    );
};