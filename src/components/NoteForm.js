import React, { useState, useEffect } from 'react';
import { addNote, updateNote, fetchNoteVersions } from '../services/NoteService';
import '../styles/NoteForm.css';

const NoteForm = ({ currentNote, userId, onSave }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [sharedWith, setSharedWith] = useState('');
    const [loading, setLoading] = useState(false);
    const [versions, setVersions] = useState([]);

    useEffect(() => {
        if (currentNote) {
            setTitle(currentNote.title);
            setContent(currentNote.content);
            setCategory(currentNote.category || '');
            setSharedWith(currentNote.sharedWith ? currentNote.sharedWith.join(', ') : '');
            fetchVersions(currentNote.id);
        } else {
            clearForm();
        }
    }, [currentNote]);

    const fetchVersions = async (noteId) => {
        try {
            const noteVersions = await fetchNoteVersions(noteId);
            setVersions(noteVersions);
        } catch (error) {
            console.error("Error fetching note versions: ", error);
        }
    };

    const clearForm = () => {
        setTitle('');
        setContent('');
        setCategory('');
        setSharedWith('');
        setVersions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const sharedWithArray = sharedWith.split(',').map(email => email.trim());
        try {
            if (currentNote) {
                await updateNote(currentNote.id, title, content, category, sharedWithArray);
                onSave({ ...currentNote, title, content, category, sharedWith: sharedWithArray });
                clearForm();
            } else {
                const noteId = await addNote(title, content, userId, category, sharedWithArray);
                onSave({ id: noteId, title, content, userId, createdAt: new Date(), category, sharedWith: sharedWithArray });
                clearForm();
            }
        } catch (error) {
            console.error("Error saving note: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRevert = async (version) => {
        setLoading(true);
        try {
            await updateNote(currentNote.id, version.title, version.content, version.category, version.sharedWith);
            onSave({ ...currentNote, title: version.title, content: version.content, category: version.category, sharedWith: version.sharedWith });
            clearForm();
        } catch (error) {
            console.error("Error reverting note: ", error);
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

            {versions.length > 0 && (
                <div className="note-versions">
                    <h3>Previous Versions</h3>
                    <ul>
                        {versions.map((version) => (
                            <li key={version.id}>
                                <strong>{version.createdAt.toDate().toLocaleString()}</strong>
                                <p>{version.title}</p>
                                <p>{version.content}</p>
                                <p><strong>Category:</strong> {version.category}</p>
                                <p><strong>Shared with:</strong> {version.sharedWith.join(', ')}</p>
                                <button onClick={() => handleRevert(version)}>Revert</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default NoteForm;
