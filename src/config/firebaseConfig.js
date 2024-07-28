import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCU8nTSUpmyS2i5Ydc6XgGPDWTGzti0qCc",
    authDomain: "note-taking-app-baf98.firebaseapp.com",
    projectId: "note-taking-app-baf98",
    storageBucket: "note-taking-app-baf98.appspot.com",
    messagingSenderId: "51572745646",
    appId: "1:51572745646:web:c12ad9117df8d29d14543f",
    measurementId: "G-SN7FMGQPKW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);
const db = getFirestore(app);

export { auth, db, onAuthStateChanged };
