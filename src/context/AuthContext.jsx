import { React, createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";

const AuthContext = createContext({
    user: null,
    isLoading: true
});

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const userSignUp = (email, password, name) => 
        createUserWithEmailAndPassword(auth, email, password)
        .then(() => updateProfile(auth.currentUser, { displayName: name }));    //Requires update: displayName can be used for XSS attack

    const userSignIn = (email, password) => signInWithEmailAndPassword(auth, email, password);

    const googleUserSignIn = () => signInWithPopup(auth, googleProvider);

    const userSignOut = () => signOut(auth);

    const forgotPassword = email => sendPasswordResetEmail(auth, email);

    useEffect(() => onAuthStateChanged(auth, user => {
        console.log(user);
        setIsLoading(true);
        setUser(user);
        setIsLoading(false);
    }, []))

    return (
        <AuthContext.Provider value={{ forgotPassword, googleUserSignIn, isLoading, user, userSignUp, userSignIn, userSignOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const UserAuth = () => useContext(AuthContext);