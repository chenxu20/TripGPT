import { createContext, useEffect, useState } from 'react';
import { auth, database, googleProvider } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    EmailAuthCredential,
    EmailAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updatePassword,
    updateProfile
} from "firebase/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
        const userRef = doc(database, "users", userCred.user.uid);
        await setDoc(userRef, {
            uid: userCred.user.uid,
            name: name,
            email: email,
            createdAt: new Date()
        });
        setUser(userCred.user);
    };

    const userSignIn = async (email, password) => {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCred.user);
    };

    const googleUserSignIn = async () => {
        const userCred = await signInWithPopup(auth, googleProvider);

        const userRef = doc(database, "users", userCred.user.uid);
        const userDocSnapshot = await getDoc(userRef);
        if (!userDocSnapshot.exists()) {
            await setDoc(userRef, {
                uid: userCred.user.uid,
                name: userCred.user.displayName,
                email: userCred.user.email,
                createdAt: new Date()
            });
        }

        setUser(userCred.user);
    };

    const userSignOut = async () => {
        await signOut(auth);
        setUser(null);
    };

    const changePassword = async (password, newPassword) => {
        const user = auth.currentUser;
        console.log("a");
        const credential = EmailAuthProvider.credential(
            user.email,
            password
        );
        console.log("b");
        await reauthenticateWithCredential(user, credential);
        console.log("c");
        await updatePassword(user, newPassword);
        console.log("d");
    };

    const forgotPassword = async email => {
        await sendPasswordResetEmail(auth, email);
    };

    return (
        <AuthContext.Provider value={{ changePassword, forgotPassword, googleUserSignIn, loading, setLoading, user, userSignUp, userSignIn, userSignOut }}>
            {children}
        </AuthContext.Provider>
    );
};