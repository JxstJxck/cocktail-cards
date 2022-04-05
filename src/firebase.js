import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import credentials from "./credentials.json";

const app = initializeApp(credentials);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };