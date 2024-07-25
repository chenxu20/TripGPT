import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import "./user-auth/style.css";
import { Alert, AlertMessage } from './AlertMessage';

export const Account = () => {
    const { user, userSignOut } = useContext(AuthContext);
    const navigate = useNavigate("");
    const location = useLocation();
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (location.state && location.state.alert) {
            setAlert(location.state.alert);
        }
    }, [location.state]);

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
            <div>
                <h1>Account</h1>
                <p>Name: {user.displayName}</p>
                <p>Email: {user.email}</p>
                <button className="form-button" onClick={handleSignOut}>Sign Out</button>
            </div>
        </>
    );
}