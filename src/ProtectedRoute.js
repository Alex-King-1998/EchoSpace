// src/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig'; // Import auth

const ProtectedRoute = ({ element }) => {
    const user = auth.currentUser; // Get the current user from Firebase auth

    // If user is not logged in, redirect to login page
    return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
