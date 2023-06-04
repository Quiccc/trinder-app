import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../server/config/FirebaseConfig";
import { getCurrentUserDetails } from "../server/UserService";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState({
        name: "",
        surname: "",
        email: "",
        isAdmin: false,
        premiumID: null,
        profile_image: null,
    });
    const getDetails = async () => {
        await getCurrentUserDetails().then((res) => {
            setUserDetails(res);
        });
    };
    const logout = () => {
        signOut(auth);
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                getDetails();
                setLoading(false);
            }else {
                setCurrentUser(null);
                setLoading(false);
            }
        });

        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }


        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const value = {
        currentUser,
        userDetails,
        setUserDetails,
        logout,
        loading,
        setLoading,
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}