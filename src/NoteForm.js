import React, { useState } from 'react';
import { addNote, updateNote } from './notesService';

const NoteForm = ({ currentNote, userId, onSave }) => {
    const [title, setTitle] = useState(currentNote?.title || '');
    const [content, setContent] = useState(currentNote?.content || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentNote) {
            await updateNote(currentNote.id, title, content);
        } else {
            await addNote(title, content, userId);
        }
        onSave();
    };

    return (
        <form onSubmit={handleSubmit}>
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
            <button type="submit">{currentNote ? 'Update' : 'Add'} Note</button>
        </form>
    );
};

export default NoteForm;
