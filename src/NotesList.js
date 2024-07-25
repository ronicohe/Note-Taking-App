import React, { useEffect, useState } from 'react';
import { fetchNotesByUser, deleteNote } from './notesService';

const NotesList = ({ userId }) => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const loadNotes = async () => {
            const fetchedNotes = await fetchNotesByUser(userId);
            setNotes(fetchedNotes);
        };

        loadNotes();
    }, [userId]);

    const handleDelete = async (noteId) => {
        await deleteNote(noteId);
        setNotes(notes.filter((note) => note.id !== noteId));
    };

    return (
        <div>
            <h2>Your Notes</h2>
            <ul>
                {notes.map((note) => (
                    <li key={note.id}>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                        <button onClick={() => handleDelete(note.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotesList;
