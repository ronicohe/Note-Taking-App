import React, { useState, useEffect } from 'react';
import NoteForm from './NoteForm';
import NotesList from './NotesList';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { subscribeToNotesByUser, subscribeToSharedNotes } from '../services/NoteService';
import '../styles/Dashboard.css';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [currentNote, setCurrentNote] = useState(null);
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribeFromUserNotes = subscribeToNotesByUser(currentUser.uid, (userNotes) => {
            setNotes((prevNotes) => {
                const nonSharedNotes = prevNotes.filter(note => note.userId !== currentUser.uid);
                return [...userNotes, ...nonSharedNotes];
            });
        });

        const unsubscribeFromSharedNotes = subscribeToSharedNotes(currentUser.email, (sharedNotes) => {
            setNotes((prevNotes) => {
                const userNotes = prevNotes.filter(note => note.userId === currentUser.uid);
                return [...userNotes, ...sharedNotes];
            });
        });

        return () => {
            unsubscribeFromUserNotes();
            unsubscribeFromSharedNotes();
        };
    }, [currentUser.uid, currentUser.email]);

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

    const handleEdit = (note) => {
        setCurrentNote(note);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-header">Add A Note</h2>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <NoteForm currentNote={currentNote} userId={currentUser.uid} onSave={handleSave} />
            <NotesList userId={currentUser.uid} notes={notes} setNotes={setNotes} onEdit={handleEdit} />
        </div>
    );
};

export default Dashboard;
