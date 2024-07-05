import React from "react";
import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const { isLoading, user } = UserAuth();
    if (isLoading || !user) {
        return <Navigate to="/signin" />
    }

    return children;
}