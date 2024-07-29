import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, AlertMessage } from './AlertMessage';
import "./user-auth/style.css";
import "./Account.css"
import { ChangePasswordModal } from './user-auth/ChangePassword';

export const Account = () => {
    const { changePassword, user, userSignOut } = useContext(AuthContext);
    const navigate = useNavigate("");
    const location = useLocation();
    const [alert, setAlert] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (location.state && location.state.alert) {
            setAlert(location.state.alert);
        }
    }, [location.state]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSignOut = async () => {
        try {
            await userSignOut();
            navigate("/signin", { replace: true, state: { alert: new Alert("You have signed out successfully.", 5000, "success") } });
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            <AlertMessage alert={alert} setAlert={setAlert} />
            <div className="account-wrapper">
                <h1>Account</h1>
                <div className="account-detail-wrapper">
                    <div>Name: {user.displayName}</div>
                    <div>Email: {user.email}</div>
                    <div className="account-button-wrapper">
                        <button className="account-button" onClick={openModal}>Change Password</button>
                        <ChangePasswordModal isModalOpen={isModalOpen} closeModal={closeModal} changePassword={changePassword} setAlert={setAlert} />
                        <button className="account-button" onClick={handleSignOut}>Sign Out</button>
                    </div>
                </div>
            </div>
        </>
    );
}