import React from 'react';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Account = () => {
    const { user, userSignOut } = UserAuth();
    const navigate = useNavigate("");

    const processSignOut = async () => {
        try {
            await userSignOut();
            navigate("/signin");
            console.log("You have signed out successfully.")
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div>
            <h1>Account</h1>
            <p>Name: {user.displayName}</p>
            <p>Email: {user.email}</p>
            <button onClick={ processSignOut }>Sign Out</button>
        </div>
    );
}