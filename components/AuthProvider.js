import { createContext, useState, useEffect, useContext } from 'react'
import nookies from "nookies";
import { auth } from '../src/firebase';

// rate limiting writes
// https://stackoverflow.com/questions/56487578/how-do-i-implement-a-write-rate-limit-in-cloud-firestore-security-rules

const AuthContext = createContext({ user: null });

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onIdTokenChanged(async (user) => {
            // add user's token to cookies for all page/api reqs,

            if(!user) {
                setUser(null);
                // clear user token from cookies
                nookies.set(undefined, "token", "", { path: "/" });
            } else {
                const token = await user.getIdToken();
                setUser(user);
                // set the user token in the cookies
                nookies.set(undefined, "token", token, { path: "/" })
            }
        });

        return unsubscribe;
    }, []);

    // token is refreshed every hour as long as persistent connection to 
    // firebase servers
    useEffect(() => {
        const handle = setInterval(async () => {
            const user = auth.currentUser;
            if(user) await user.getIdToken(true);
        }, 10 * 60 * 1000);

        return () => clearInterval(handle);
    }, []);

    return (
        <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
