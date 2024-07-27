import React, { useState } from 'react';
import './style.css';

export const ChangePasswordModal = ({ isModalOpen, closeModal, changePassword }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (newPassword !== confirmPassword) {
                throw new Error("Passwords do not match.");
            }
            await changePassword(currentPassword, newPassword);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return isModalOpen && (
        <div className="account-modal">
            <div className="account-modal-overlay" onClick={closeModal}></div>
            <div className="account-modal-content">
                <span className="account-modal-close-button" onClick={closeModal}>&#10006;</span>
                <h2>Change Password</h2>
                <form id="change-password-form" onSubmit={handleSubmit} autoComplete="off">
                    <label>
                        Current password
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            placeholder="Current password"
                            required
                        />
                    </label>
                    <label>
                        New password
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="New password"
                            required
                        />
                    </label>
                    <label>
                        Confirm password
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            required
                        />
                    </label>
                    {errorMessage && <span>{errorMessage}</span>}
                    <button type="submit" className="account-button">Change Password</button>
                </form>
            </div>
        </div>
    );
};