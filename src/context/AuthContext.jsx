import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from "firebase/auth";

const AuthContext = createContext({
    user: null,
    loading: true,
    error: null,
    userSignUp: async () => { },
    userSignIn: async () => { },
    googleUserSignIn: async () => { },
    userSignOut: async () => { },
    forgotPassword: async () => { },
    setError: () => { },
    setLoading: () => { }
});

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const userSignUp = async (email, password, name) => {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(auth.currentUser, { displayName: name });
        await sendEmailVerification(userCred.user);
        setUser(userCred.user);
    };

    const userSignIn = async (email, password) => {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCred.user);
    };

    const googleUserSignIn = async () => {
        const userCred = await signInWithPopup(auth, googleProvider);
        setUser(userCred.user);
    };

    const userSignOut = async () => {
        await signOut(auth);
        setUser(null);
    };

    const forgotPassword = async email => {
        await sendPasswordResetEmail(auth, email);
    };

    return (
        <AuthContext.Provider value={{ forgotPassword, googleUserSignIn, loading, setLoading, user, userSignUp, userSignIn, userSignOut, error, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => useContext(AuthContext);