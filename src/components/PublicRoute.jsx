import React from "react";
import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
    const { isLoading, user } = UserAuth();
    if (!isLoading && user) {
        return <Navigate to="/account" />
    }

    return children;
}