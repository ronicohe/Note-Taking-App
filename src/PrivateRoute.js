import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { currentUser } = useAuth();

    return (
        <Route
            {...rest}
            element={currentUser ? <Component {...rest} /> : <Navigate to="/login" />}
        />
    );
};

export default PrivateRoute;
