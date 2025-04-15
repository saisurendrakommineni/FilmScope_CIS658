import {  useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../CSS/MovieDetails.module.css"
import defaultPlaceholder from '../assets/default-placeholder.png';



function MovieDetails() {
    const navigate = useNavigate();
    const { movieId } = useParams();
    // const location = useLocation();
    const { user } = useContext(AuthContext);  
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://filmscope-cis658.onrender.com/api/movies/${movieId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched Movie Details:", data);  
                setMovie(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching movie details:", error);
                setLoading(false);
            });
    }, [movieId]);

    if (loading) return <p>Loading...Please Wait</p>;
    if (!movie) return <p>Movie not found.</p>;

    const handleDeleteMovie = async () => {
        if (!user || user.role !== "admin") {
            alert("Unauthorized: Only admins can delete movies.");
            return;
        }

        const confirmDelete = window.confirm(`Are you sure you want to delete ${movie.name}?`);
        if (!confirmDelete) return;
    
        const token = localStorage.getItem("token");  

        if (!token) {
            alert("Unauthorized: Please log in again.");
            return;
        }

        try 
        {
            const response = await fetch(`https://filmscope-cis658.onrender.com/api/movies/delete/${movie._id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`  
                }
            });

            if (response.ok) {
                alert(`${movie.name} has been deleted.`);
                navigate("/movies"); 
            } else {
                const errorMessage = await response.json();
                alert(`Failed to delete movie: ${errorMessage.message}`);
            }
        } 
        catch (error) 
        {
            console.error("Error deleting movie:", error);
            alert("Server error.");
        }
    };

    const handleEditMovie = () => {
        if (!user || user.role !== "admin") {
            alert("Unauthorized: Only admins can edit movies.");
            return;
        }
        navigate(`/edit-movie/${movie._id}`, { state: { movie } });
    };

    const getImageSrc = (movie) => {
      if (!movie?.image) return defaultPlaceholder;
  
      if (movie.image.startsWith("data:image")) return movie.image;
  
      try {
          return require(`../assets/${movie.image}`);
      } catch (error) {
          console.warn("Image not found, using default:", error);
          return defaultPlaceholder;
      }
  };
  
    return (
      <>
      
        <div className={styles.container}>
          <div className={styles.imageSection}>
            <img src={getImageSrc(movie)} alt={movie.name} />
          </div>
      
          <div className={styles.details}>
            <h1>{movie.name}</h1>
            <p className={styles.clickableLink} onClick={() => navigate(`/director-details/${encodeURIComponent(movie.director)}`, { state: { movie } })}>
              <strong><em>Director:</em></strong> {movie.director}
            </p>
            <p className={styles.clickableLink} onClick={() => navigate(`/actor-details/${encodeURIComponent(movie.actor)}`, { state: { movie } })}>
              <strong><em>Actor:</em></strong> {movie.actor}
            </p>
            <p><strong><em>Budget:</em></strong> {movie.budget}$</p>
            <p><strong><em>Box Office Gross:</em></strong> {movie.boxOfficeGross}$</p>
            <p><strong><em>Released Year:</em></strong> {movie.year}</p>
            <p><strong><em>Genre:</em></strong> {movie.genre}</p>
            <p className={styles.justified}><strong><em>Description:</em></strong> {movie.description}</p>
      
           
          </div>
      
          <div className={styles.castSection}>
            <h3>Cast and Crew</h3>
            {movie.castAndCrew && movie.castAndCrew.length > 0 ? (
              <div className={styles.castList}>
                {movie.castAndCrew.map((member, index) => (
                  <div key={index} className={styles.castItem}>
                    <strong><em>{member.role}:</em></strong> {member.name}
                  </div>
                ))}
              </div>
            ) : (
              <p>Not Available</p>
            )}
          </div>
          </div>
          {user?.role === "admin" && (
              <div className={styles.centeredButtons}>
                <button onClick={handleEditMovie}>Edit Movie</button>
                <button onClick={handleDeleteMovie}>Delete Movie</button>
              </div>
            )}
          </>
        
      );
      
    
}

export default MovieDetails;
