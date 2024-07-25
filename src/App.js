import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import { AuthProvider, useAuth } from './AuthContext';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <AuthRoutes />
                </div>
            </Router>
        </AuthProvider>
    );
}

const AuthRoutes = () => {
    const { currentUser } = useAuth();

    return (
        <Routes>
            <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
            <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={currentUser ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
        </Routes>
    );
}

const PrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();

    return currentUser ? children : <Navigate to="/login" />;
}

export default App;
