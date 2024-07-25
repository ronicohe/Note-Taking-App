import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

const notesCollectionRef = collection(db, 'notes');

export const addNote = async (title, content, userId) => {
    try {
        const docRef = await addDoc(notesCollectionRef, {
            title,
            content,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            userId,
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding note: ", error);
        throw error;
    }
};

export const updateNote = async (noteId, title, content) => {
    try {
        const noteRef = doc(db, 'notes', noteId);
        await updateDoc(noteRef, {
            title,
            content,
            updatedAt: serverTimestamp(),
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
        return notes;
    } catch (error) {
        console.error("Error fetching notes: ", error);
        throw error;
    }
};
