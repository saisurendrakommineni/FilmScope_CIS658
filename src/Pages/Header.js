import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../CSS/Header.module.css"; 

function Header() {
    const navigate = useNavigate();
    const { logoutUser } = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.removeItem("role"); 
        logoutUser(); 
        navigate("/"); 
    };

    return (
        <div className={styles.headerContainer}>
            <h3 className={styles.headerTitle} onClick={() => navigate("/movies")}>FilmScope</h3>
            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Header;
