import React from "react";
import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const { user } = UserAuth();
    if(!user) {
        return <Navigate to="/signin" />
    }
    
    return children;
}