import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export default function ProtectedRoute({ children }) {
    const { loading, user } = useContext(AuthContext);

    if (!user) {
        if (loading) {
            return <div><ClipLoader color="#ffffff" /></div>;
        } else {
            return <Navigate to="/signin" />;
        }
    }

    return children;
}