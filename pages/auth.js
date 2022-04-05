import React from "react";
import { useEffect, useCallback } from "react";
import { app, auth } from "../src/firebase";

import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
const googleProvider = new GoogleAuthProvider();


export default function SignIn() {

    //const [user, loading, error] = useAuthState(auth);

    const signIn = useCallback(async () => {
        const result = await signInWithRedirect(auth, googleProvider, );
    });

    useEffect(() => {
        signIn();
    }, []);

    return (
    <>
        <h1>Sign in</h1>
        <div id="firebaseui">{auth.currentUser}</div>
    </>
    )
    
}