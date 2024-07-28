import React, { useState, useEffect } from 'react';
import NoteForm from './NoteForm';
import NotesList from './NotesList';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { fetchNotesByUser } from '../services/NoteService';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [currentNote, setCurrentNote] = useState(null);
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadNotes = async () => {
            const fetchedNotes = await fetchNotesByUser(currentUser.uid);
            setNotes(fetchedNotes);
        };

        loadNotes();
    }, [currentUser.uid]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const handleSave = (newNote) => {
        if (currentNote) {
            setNotes(notes.map(note => (note.id === currentNote.id ? newNote : note)));
        } else {
            setNotes([newNote, ...notes]);
        }
        setCurrentNote(null);
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-header">All Notes</h2>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <NoteForm currentNote={currentNote} userId={currentUser.uid} onSave={handleSave} />
            <NotesList userId={currentUser.uid} notes={notes} setNotes={setNotes} onEdit={setCurrentNote} />
        </div>
    );
};

export default Dashboard;
