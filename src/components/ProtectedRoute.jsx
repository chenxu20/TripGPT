import React from "react";
import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export default function ProtectedRoute({ children }) {
    const { loading, user } = UserAuth();

    if (!user) {
        if (loading) {
            return <div><ClipLoader color="#ffffff" /></div>;
        } else {
            return <Navigate to="/signin" />;
        }
    }

    return children;
}