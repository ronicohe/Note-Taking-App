import React, { useState, useEffect } from 'react';
import { addNote, updateNote } from '../services/NoteService';
import '../styles/NoteForm.css';

const NoteForm = ({ currentNote, userId, onSave }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [sharedWith, setSharedWith] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentNote) {
            setTitle(currentNote.title);
            setContent(currentNote.content);
            setCategory(currentNote.category || '');
            setSharedWith(currentNote.sharedWith ? currentNote.sharedWith.join(', ') : '');
        } else {
            setTitle('');
            setContent('');
            setCategory('');
            setSharedWith('');
        }
    }, [currentNote]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const sharedWithArray = sharedWith.split(',').map(email => email.trim());
        try {
            if (currentNote) {
                await updateNote(currentNote.id, title, content, category, sharedWithArray);
                onSave({ ...currentNote, title, content, category, sharedWith: sharedWithArray });
            } else {
                const noteId = await addNote(title, content, userId, category, sharedWithArray);
                onSave({ id: noteId, title, content, userId, createdAt: new Date(), category, sharedWith: sharedWithArray });
                setTitle('');  // Clear the title field
                setContent('');  // Clear the content field
                setCategory('');  // Clear the category field
                setSharedWith('');  // Clear the sharedWith field
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
                <div>
                    <label>Share with (comma-separated emails):</label>
                    <input
                        type="text"
                        value={sharedWith}
                        onChange={(e) => setSharedWith(e.target.value)}
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
