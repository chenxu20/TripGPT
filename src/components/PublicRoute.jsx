import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { Alert } from "./AlertMessage";

export default function PublicRoute({ children }) {
    const { loading, user } = useContext(AuthContext);

    if (user) {
        if (loading) {
            return <div><ClipLoader color="#ffffff" /></div>;
        } else {
            return <Navigate 
                to="/account"
                replace
                state={{ alert: new Alert("You are already signed in.", 7000, "error") }}
            />;
        }
    }

    return children;
}