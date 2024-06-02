import React from 'react'
import { useState } from "react";
import { auth, app, googleProvider } from "../../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import "./style.css"
import { useNavigate } from 'react-router-dom';

export const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate('');

    // console.log(auth?.currentUser?.email);

    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            console.log(userCredential);
            navigate("/");
        })
        .catch(error => console.log(error));
    }

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className='wrapper'>
            <h1>Sign In</h1>
            <form onSubmit={signIn}>
                <input 
                    type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}>
                </input>
                <input 
                    type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}>
                </input>
                <button type="submit" className='submit-button'>Sign In</button>
            </form>
            <p>Don't have an account? Sign up <a href="/signup">here</a>.</p>
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