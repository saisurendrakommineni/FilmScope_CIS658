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

    const loginUser = (token, role) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);  
        const decodedUser = jwtDecode(token);
        setUser({ ...decodedUser, token, role });  
    };

    const logoutUser = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");  
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
