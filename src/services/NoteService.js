import { db } from '../config/firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, serverTimestamp, onSnapshot } from 'firebase/firestore';

const notesCollectionRef = collection(db, 'notes');

export const addNote = async (title, content, userId, category, sharedWith) => {
    try {
        const docRef = await addDoc(notesCollectionRef, {
            title,
            content,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            userId,
            category,
            sharedWith
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding note: ", error);
        throw error;
    }
};

export const updateNote = async (noteId, title, content, category, sharedWith) => {
    try {
        const noteRef = doc(db, 'notes', noteId);
        await updateDoc(noteRef, {
            title,
            content,
            updatedAt: serverTimestamp(),
            category,
            sharedWith
        });
    } catch (error) {
        console.error("Error updating note: ", error);
        throw error;
    }
};

export const deleteNote = async (noteId) => {
    try {
        const noteRef = doc(db, 'notes', noteId);
        await deleteDoc(noteRef);
    } catch (error) {
        console.error("Error deleting note: ", error);
        throw error;
    }
};

export const fetchNotesByUser = async (userId) => {
    try {
        const q = query(notesCollectionRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const notes = [];
        querySnapshot.forEach((doc) => {
            notes.push({ id: doc.id, ...doc.data() });
        });

        const sharedNotesQuery = query(notesCollectionRef, where("sharedWith", "array-contains", userId));
        const sharedNotesSnapshot = await getDocs(sharedNotesQuery);
        sharedNotesSnapshot.forEach((doc) => {
            notes.push({ id: doc.id, ...doc.data() });
        });

        return notes;
    } catch (error) {
        console.error("Error fetching notes: ", error);
        throw error;
    }
};

export const fetchNotesByCategory = async (userId, category) => {
    try {
        const q = query(notesCollectionRef, where("userId", "==", userId), where("category", "==", category));
        const querySnapshot = await getDocs(q);
        const notes = [];
        querySnapshot.forEach((doc) => {
            notes.push({ id: doc.id, ...doc.data() });
        });
        return notes;
    } catch (error) {
        console.error("Error fetching notes by category: ", error);
        throw error;
    }
};

export const subscribeToNotesByUser = (userId, callback) => {
    const q = query(notesCollectionRef, where("userId", "==", userId));
    return onSnapshot(q, (querySnapshot) => {
        const notes = [];
        querySnapshot.forEach((doc) => {
            notes.push({ id: doc.id, ...doc.data() });
        });
        callback(notes);
    });
};

export const subscribeToSharedNotes = (userEmail, callback) => {
    const q = query(notesCollectionRef, where("sharedWith", "array-contains", userEmail));
    return onSnapshot(q, (querySnapshot) => {
        const notes = [];
        querySnapshot.forEach((doc) => {
            notes.push({ id: doc.id, ...doc.data() });
        });
        callback(notes);
    });
};
