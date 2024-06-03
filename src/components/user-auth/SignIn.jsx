import React from 'react';
import { useState } from "react";
import { auth, app, googleProvider } from "../../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import "./style.css";
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';

export const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { userSignIn } = UserAuth();
    const navigate = useNavigate("");

    const processSignIn = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await userSignIn(email, password);
            navigate("/account");
        } catch (error) {
            setError(error.message);
            console.log(error.message);
        }
    }

    return (
        <div className='wrapper'>
            <h1>Sign In</h1>
            <form onSubmit={processSignIn}>
                <input 
                    type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}>
                </input>
                <input 
                    type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}>
                </input>
                <button type="submit" className='submit-button'>Sign In</button>
            </form>
            <p>Don't have an account? Sign up <Link to="/signup">here</Link>.</p>
        </div>
    );
/*
    TO DO: Sign in with Google, and Sign Out feature

    <button onClick={signInWithGoogle}>Sign In With Google</button>
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    }
    <button onClick={logout}>Sign Out</button>
*/
}