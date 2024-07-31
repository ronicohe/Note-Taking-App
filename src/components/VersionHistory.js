import React, { useState, useEffect } from 'react';
import { fetchNoteVersions, updateNote } from '../services/NoteService';
import '../styles/NoteForm.css';

const VersionHistory = ({ noteId, onRevert }) => {
    const [versions, setVersions] = useState([]);

    useEffect(() => {
        const loadVersions = async () => {
            const fetchedVersions = await fetchNoteVersions(noteId);
            setVersions(fetchedVersions);
        };

        loadVersions();
    }, [noteId]);

    const handleRevert = async (version) => {
        await updateNote(noteId, version.title, version.content, version.category, version.sharedWith);
        onRevert(version);
    };

    return (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ textAlign: 'center', color: '#333' }}>Version History</h3>
            <ul>
                {versions.map(version => (
                    <li key={version.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0', transition: 'background-color 0.3s ease' }}>
                        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{version.title}</p>
                        <p>{version.content}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong>Category:</strong>
                            <p>{version.category}</p>
                        </div>
                        <button style={{ padding: '10px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', marginTop: '10px', fontSize: '14px', transition: 'background-color 0.3s ease, transform 0.2s' }} onClick={() => handleRevert(version)}>Revert</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VersionHistory;
