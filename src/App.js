// src/App.js
import React, { useState, useEffect } from 'react';
import { auth, firestore } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      if (user) {
        const notesCollection = collection(firestore, "notes");
        const notesSnapshot = await getDocs(notesCollection);
        const notesList = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotes(notesList);
      }
    };
    fetchNotes();
  }, [user]);

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(result => {
          setUser(result.user);
        })
        .catch(error => {
          console.error("Error signing in: ", error);
        });
  };

  const handleSignOut = () => {
    signOut(auth)
        .then(() => {
          setUser(null);
          setNotes([]);
        })
        .catch(error => {
          console.error("Error signing out: ", error);
        });
  };

  const handleAddNote = async () => {
    if (newNote.trim() !== "") {
      try {
        const docRef = await addDoc(collection(firestore, "notes"), {
          text: newNote,
          createdAt: new Date(),
          userId: user.uid
        });
        setNotes([...notes, { id: docRef.id, text: newNote }]);
        setNewNote("");
      } catch (e) {
        console.error("Error adding note: ", e);
      }
    }
  };

  return (
      <div className="App">
        <header className="App-header">
          {user ? (
              <>
                <p>Welcome, {user.displayName}</p>
                <button onClick={handleSignOut}>Sign Out</button>
                <div>
                  <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                  />
                  <button onClick={handleAddNote}>Add Note</button>
                  <ul>
                    {notes.map(note => (
                        <li key={note.id}>{note.text}</li>
                    ))}
                  </ul>
                </div>
              </>
          ) : (
              <button onClick={handleSignIn}>Sign In with Google</button>
          )}
        </header>
      </div>
  );
}

export default App;
