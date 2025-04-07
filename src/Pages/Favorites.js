import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

function Favorites() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);

    const fetchFavorites = useCallback(async () => {
        if (!user?.token) return;
    
        try {
            const response = await fetch("http://localhost:5000/api/favorites/", {
                headers: { Authorization: `Bearer ${user.token}` }
            });
    
            if (response.ok) {
                const data = await response.json();
                setFavorites(data); 
            } else {
                setFavorites([]); 
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    }, [user?.token]);
    
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);
    
    const removeFavorite = async (movieId) => {
        try {
            const response = await fetch(`https://filmscope-cis658.onrender.com/api/favorites/remove/${movieId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                setFavorites((prevFavorites) => prevFavorites.filter((movie) => movie._id !== movieId));
            }
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };

    return (
        <div>
            <h1>My Favorite Movies</h1>
            {favorites.length > 0 ? (
                favorites.map((movie) => (
                    <div key={movie._id} style={{ display: "flex", alignItems: "center" }}>
                        <p onClick={() => navigate(`/movie-details/${movie._id}`)}> {movie.name}</p>
                        <FaTrash style={{ cursor: "pointer", marginLeft: "10px", color: "red" }} onClick={() => removeFavorite(movie._id)}/>
                    </div>
                )) ) :( <p>No favorite movies added.</p>)
            }
            <button onClick={() => navigate("/movies")}>Back to Movies</button>
        </div>
    );
}

export default Favorites;
