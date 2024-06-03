import React from 'react'
import { useState } from "react";
import { auth, app, googleProvider } from "../../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import "./style.css"
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';

export const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const { userSignUp } = UserAuth();
    const navigate = useNavigate("");

    const processSignUp = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if(!(password === confirmPassword)) {
                throw new Error("Passwords do not match.");
            }
            await userSignUp(email, password, name);
            navigate("/account");
        } catch (error) {
            setError(error.message);
            console.log(error.message);
        }
    }

    return (
        <div className='wrapper'>
            <h1>Sign Up</h1>
            <form onSubmit={processSignUp}>
                <input type="name" placeholder="Name" onChange={e => setName(e.target.value)} />
                <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                <input type="password" placeholder="Confirm password" onChange={e => setConfirmPassword(e.target.value)} />
                <button type="submit" className='submit-button'>Sign Up</button>
            </form>
            <p>Already a registered user? Sign in <Link to="/signin">here</Link>.</p>
        </div>
    );
}