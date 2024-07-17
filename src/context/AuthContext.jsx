import { React, createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";

const AuthContext = createContext({
    user: null,
    isLoading: true
});

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const userSignUp = async (email, password, name) => {
        setIsLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, { displayName: name });
        } finally {
            setIsLoading(false);
        }
    };

    const userSignIn = async (email, password) => {
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } finally {
            setIsLoading(false);
        }
    };

    const googleUserSignIn = async () => {
        setIsLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
        } finally {
            setIsLoading(false);
        }
    };

    const userSignOut = async () => {
        setIsLoading(true);
        try {
            await signOut(auth);
        } finally {
            setIsLoading(false);
        }
    };

    const forgotPassword = async email => {
        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setUser(user);
            setIsLoading(false);
        });
        return unsubscribe;
    }, [])

    return (
        <AuthContext.Provider value={{ forgotPassword, googleUserSignIn, isLoading, user, userSignUp, userSignIn, userSignOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const UserAuth = () => useContext(AuthContext);