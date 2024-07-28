import React, { useState, useEffect } from 'react';
import { addNote, updateNote } from '../services/NoteService';
import '../styles/NoteForm.css';

const NoteForm = ({ currentNote, userId, onSave }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentNote) {
            setTitle(currentNote.title);
            setContent(currentNote.content);
            setCategory(currentNote.category || '');
        } else {
            setTitle('');
            setContent('');
            setCategory('');
        }
    }, [currentNote]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (currentNote) {
                await updateNote(currentNote.id, title, content, category);
                onSave({ ...currentNote, title, content, category });
            } else {
                const noteId = await addNote(title, content, userId, category);
                onSave({ id: noteId, title, content, userId, createdAt: new Date(), category });
                setTitle('');  // Clear the title field
                setContent('');  // Clear the content field
                setCategory('');  // Clear the category field
            }
        } catch (error) {
            console.error("Error saving note: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <div className="spinner-overlay"><img src="/images/spinner.gif" alt="Loading..." className="spinner" /></div>}
            <form className="note-form" onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {currentNote ? 'Update' : 'Add'} Note
                </button>
            </form>
        </>
    );
};

export default NoteForm;
