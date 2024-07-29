import React, { useEffect, useState } from 'react';
import { fetchNotesByUser, fetchNotesByCategory, deleteNote } from '../services/NoteService';
import '../styles/NoteList.css';

const NotesList = ({ userId, notes, setNotes, onEdit }) => {
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        setFilteredNotes(notes);
    }, [notes]);

    const handleDelete = async (noteId) => {
        await deleteNote(noteId);
        setNotes(notes.filter((note) => note.id !== noteId));
    };

    const handleCategoryClick = async (category) => {
        setSelectedCategory(category);
        if (category) {
            const filtered = await fetchNotesByCategory(userId, category);
            setFilteredNotes(filtered);
        } else {
            setFilteredNotes(notes);
        }
    };

    const uniqueCategories = [...new Set(notes.map(note => note.category))];

    return (
        <div className="notes-list">
            <h2>Your Notes</h2>
            <div className="categories">
                <button onClick={() => handleCategoryClick('')}>All</button>
                {uniqueCategories.map((category) => (
                    <button key={category} onClick={() => handleCategoryClick(category)}>
                        {category}
                    </button>
                ))}
            </div>
            <ul>
                {filteredNotes.map((note) => (
                    <li key={note.id}>
                        <p className="note-list-category-title"><strong>Category:</strong> {note.category}</p>
                        <div className="note-content">
                            <h3>{note.title}</h3>
                            <p>{note.content}</p>
                            <p className="note-list-shared-with">
                                <strong>Shared with:</strong> {note.sharedWith && note.sharedWith.length > 0 ? note.sharedWith.join(', ') : "no one"}
                            </p>
                        </div>
                        <button onClick={() => onEdit(note)} className="edit-button">Edit</button>
                        <button onClick={() => handleDelete(note.id)} className="delete-button">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotesList;
