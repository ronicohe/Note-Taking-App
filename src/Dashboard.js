import React, { useState } from 'react';
import NoteForm from './NoteForm';
import NotesList from './NotesList';
import { useAuth } from './AuthContext';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [currentNote, setCurrentNote] = useState(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const handleSave = () => {
        setCurrentNote(null);
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
            <NoteForm currentNote={currentNote} userId={currentUser.uid} onSave={handleSave} />
            <NotesList userId={currentUser.uid} />
        </div>
    );
};

export default Dashboard;
