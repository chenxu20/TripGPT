import { React, createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";

const UserContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({});

    const userSignUp = (email, password, name) => 
        createUserWithEmailAndPassword(auth, email, password)
        .then(() => updateProfile(auth.currentUser, { displayName: name }));    //Requires update: displayName can be used for XSS attack

    const userSignIn = (email, password) => signInWithEmailAndPassword(auth, email, password);

    const userSignOut = () => signOut(auth);

    const forgotPassword = email => true;

    useEffect(() => onAuthStateChanged(auth, user => {
        console.log(user);
        setUser(user);
    }))

    return (
        <UserContext.Provider value={{ user, userSignUp, userSignIn, userSignOut }}>{children}</UserContext.Provider>
    );
}

export const UserAuth = () => useContext(UserContext);