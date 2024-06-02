import React from 'react'
import { useState } from "react";
import { auth, app, googleProvider } from "../../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import "./style.css"
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate("");

    // console.log(auth?.currentUser?.email);

    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            console.log(userCredential);
            navigate("/signin");
        })
        .catch(error => console.log(error));
    }

    return (
        <div className='wrapper'>
            <h1>Sign Up</h1>
            <form onSubmit={signUp}>
                <input 
                    type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}>
                </input>
                <input 
                    type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}>
                </input>
                <button type="submit" className='submit-button'>Sign Up</button>
            </form>
            <p>Already a registered user? Sign in <a href="/signin">here</a>.</p>
        </div>
    );
}