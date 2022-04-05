import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useState } from "react";

const auth = getAuth();

// language code for sign in flow
//auth.languageCode = "it";

const googleProvider = new GoogleAuthProvider();

export default function useAuth() {

    const [ user, setUser ] = useState(auth.user);
    const [ loading, setLoading ] = useState(false);

    const signInWithGoogle = async () => {
        setLoading(true);
        signInWithRedirect(auth, googleProvider);

        try {
            const result = await getRedirectResult();
            return result;
        } catch(error) {
            return error;
        } finally {
            setLoading(false);
        }
    } 

    return [ user, loading, signInWithGoogle ];

}

// add scopes
//provider.addScope('https://www.googleapis.com/auth/contacts.readonly');