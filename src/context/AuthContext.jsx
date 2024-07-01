import { React, createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";

const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({});

    const userSignUp = (email, password, name) => 
        createUserWithEmailAndPassword(auth, email, password)
        .then(() => updateProfile(auth.currentUser, { displayName: name }));    //Requires update: displayName can be used for XSS attack

    const userSignIn = (email, password) => signInWithEmailAndPassword(auth, email, password);

    const googleUserSignIn = () => signInWithPopup(auth, new GoogleAuthProvider());

    const userSignOut = () => signOut(auth);

    const forgotPassword = email => true;

    useEffect(() => onAuthStateChanged(auth, user => {
        console.log(user);
        setUser(user);
    }))

    return (
        <AuthContext.Provider value={{ googleUserSignIn, user, userSignUp, userSignIn, userSignOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const UserAuth = () => useContext(AuthContext);