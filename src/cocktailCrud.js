import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const createCocktail = async (data) => {
    try {
        const docRef = await addDoc(collection(db, "cocktails"), data);
        console.log(`Created new cocktail with id ${docRef.id}`);
    } catch (error) {
        return error;
    }
}

const editCocktail = async (id, data) => {
    try {
        const docRef = await updateDoc(doc(db, "cocktails", id), data);
    } catch(error) {
        return error;
    }
}

export { createCocktail, editCocktail };