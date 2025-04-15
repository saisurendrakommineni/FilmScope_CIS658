import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role");

        if (storedToken) {
            return { ...jwtDecode(storedToken), token: storedToken, role: storedRole };
        }
        return null;
    });

    const [isGuest, setIsGuest] = useState(() => localStorage.getItem("role") === "guest");

    const loginUser = (token, role) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        setIsGuest(false); 
        const decodedUser = jwtDecode(token);
        setUser({ ...decodedUser, token, role });
    };

    const loginGuest = () => {
        localStorage.setItem("role", "guest");
        setIsGuest(true);
        setUser(null); 
    };

    const logoutUser = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUser(null);
        setIsGuest(false);
    };

    return (
        <AuthContext.Provider value={{ user, isGuest, loginUser, loginGuest, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
