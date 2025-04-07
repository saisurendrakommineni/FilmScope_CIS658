import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegStar, FaStar,FaBars } from "react-icons/fa";
import Rating from "react-rating";
import { AuthContext } from "../context/AuthContext";
import styles from "../CSS/Movies.module.css";
import Select from 'react-select';
import defaultPlaceholder from '../assets/default-placeholder.png';


function Movies() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);  
    const [movies, setMovies] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [ratings, setRatings] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [topMoviesCount, setTopMoviesCount] = useState("All");
    const [customCount, setCustomCount] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);

    const toggleFilters = () => setFiltersOpen(!filtersOpen);


    const fetchFavorites = useCallback(async () => {
        if (!user?.token) return;
        try {
            const response = await fetch("https://filmscope-cis658.onrender.com/api/favorites/", {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setFavorites(data.map(movie => movie._id)); 
            } else {
                setFavorites([]); 
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    }, [user?.token]);

    const fetchRatings = useCallback(async () => {
        if (!user?.token) return;
        try {
            const response = await fetch("https://filmscope-cis658.onrender.com/api/ratings/user", {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    const ratingsMap = data.reduce((acc, { movie, rating }) => {
                        acc[movie] = rating;
                        return acc;
                    }, {});
                    setRatings(ratingsMap); 
                }
            } else {
                console.error("Error fetching ratings:", response.statusText);
                setRatings({}); 
            }
        } catch (error) {
            console.error("Error fetching ratings:", error);
        }
    }, [user?.token]);

    useEffect(() => {
        fetch("https://filmscope-cis658.onrender.com/api/movies/all")
            .then((response) => response.json())
            .then((data) => setMovies(data))
            .catch((error) => console.error("Error fetching movies:", error));

        fetchFavorites();  
        fetchRatings();  
    }, [fetchFavorites, fetchRatings, user]); 

    const toggleFavorite = async (movie) => {
        if (!user || user.role !== "user") return;
        try {
            const isFavorite = favorites.includes(movie._id);
            const url = `https://filmscope-cis658.onrender.com/api/favorites/${isFavorite ? "remove" : "add"}/${movie._id}`;
            const response = await fetch(url, {
                method: isFavorite ? "DELETE" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            });
            if (response.ok) {
                setFavorites((prevFavorites) =>
                    isFavorite ? prevFavorites.filter(id => id !== movie._id) : [...prevFavorites, movie._id]
                );
            }
        } catch (error) {
            console.error("Error updating favorite:", error);
        }
    };

    const handleRatingChange = async (newRating, movieId) => {
        if (!user || user.role !== "user") return;
        setRatings((prevRatings) => ({ ...prevRatings, [movieId]: newRating }));
        try {
            const response = await fetch(`https://filmscope-cis658.onrender.com/api/ratings/rate/${movieId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ rating: newRating })
            });
            if (!response.ok) throw new Error("Failed to update rating");
        } catch (error) {
            console.error("Error updating rating:", error);
        }
    };

    const parseBoxOfficeGross = (gross) => {
        const value = parseFloat(gross.replace(/[^0-9.]/g, ""));
        const unit = gross.toUpperCase(); 
        if (unit.includes("B")) return value * 1_000_000_000;
        else if (unit.includes("M")) return value * 1_000_000;
        else if (unit.includes("K")) return value * 1_000;
        else return value;
    };

    const industries = [...new Set(movies.map(movie => movie.industry))].sort((a, b) => a.localeCompare(b));
    const years = [...new Set(movies.map(movie => movie.year))].sort((a, b) => a - b);
    const genres = [...new Set(movies.map(movie => movie.genre))].sort((a, b) => a.localeCompare(b));

    const industryOptions = industries.map(ind => ({ value: ind, label: ind }));
    const yearOptions = years.map(year => ({ value: year, label: year }));
    const genreOptions = genres.map(genre => ({ value: genre, label: genre }));

    const filteredMovies = movies
        .filter(movie =>
            (searchTerm === "" || movie.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedIndustries.length === 0 || selectedIndustries.includes(movie.industry)) &&
            (selectedYears.length === 0 || selectedYears.includes(movie.year)) &&
            (selectedGenres.length === 0 || selectedGenres.includes(movie.genre))
        )
        .sort((a, b) => parseBoxOfficeGross(b.boxOfficeGross) - parseBoxOfficeGross(a.boxOfficeGross));

    const getTopMoviesForIndustry = (industryMovies) => {
        const count = topMoviesCount === "Custom" ? parseInt(customCount, 10) : parseInt(topMoviesCount, 10);
        if (topMoviesCount === "All" || isNaN(count) || count <= 0) return industryMovies;
        return industryMovies.slice(0, count);
    };

    const clearAllFilters = () => { setSearchTerm(""); setSelectedIndustries([]); setSelectedYears([]); setSelectedGenres([]); setTopMoviesCount("All");
        setCustomCount("");
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h1>Movies List</h1>
                <input type="text" placeholder="Search Movie Name" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className={styles.searchInput} />
            </div>

            <div className={styles.filterHeader}>
                <FaBars className={styles.hamburgerIcon} onClick={toggleFilters} />
            </div>

            <div className={`${styles.selects} ${filtersOpen ? styles.showFilters : ""}`}>
                 <Select options={industryOptions} placeholder="Select Industry" isClearable isMulti className={styles.selectDropdown}
                    value={industryOptions.filter(opt => selectedIndustries.includes(opt.value))}
                    onChange={(selected) => setSelectedIndustries(selected ? selected.map(opt => opt.value) : [])} />

                <Select options={yearOptions} placeholder="Select Year" isClearable isMulti className={styles.selectDropdown}
                    value={yearOptions.filter(opt => selectedYears.includes(opt.value))}
                    onChange={(selected) => setSelectedYears(selected ? selected.map(opt => opt.value) : [])} />

                <Select options={genreOptions} placeholder="Select Genre" isClearable isMulti className={styles.selectDropdown}
                    value={genreOptions.filter(opt => selectedGenres.includes(opt.value))}
                    onChange={(selected) => setSelectedGenres(selected ? selected.map(opt => opt.value) : [])} />

                <label>Show Top Movies</label>
                <select value={topMoviesCount} onChange={(e) => setTopMoviesCount(e.target.value)} className={styles.selectDropdown}>
                    <option value="All">All</option>
                    <option value="Custom">Custom</option>
                    <option value="2">Top 2</option>
                    <option value="10">Top 10</option>
                    <option value="25">Top 25</option>
                    <option value="100">Top 100</option>
                </select>

                {topMoviesCount === "Custom" && (
                    <input type="number" placeholder="Enter number" value={customCount}
                    onChange={(e) => setCustomCount(e.target.value)} />
                )}

                <button className={styles.clearBtn} onClick={clearAllFilters}>Clear All Filters</button>

                <div className={styles.buttonGroup}>
                    {user?.role === "admin" && (
                    <button onClick={() => navigate("/add-movie")}>Add New Movie</button>
                    )}
                    {user?.role === "user" && (
                    <button onClick={() => navigate("/favorites")}>View Favorites</button>
                    )}
                </div>
            </div>


            {industries.map(industry => {
                const industryMovies = filteredMovies.filter(movie => movie.industry === industry);
                const topMovies = getTopMoviesForIndustry(industryMovies);
                if (topMovies.length === 0) return null;

                return (
                    <div key={industry} className={styles.industrySection}>
                        <h2 className={styles.industryTitle}>Top Grossing Movies in {industry}</h2>
                        <div className={styles.movieRow}>
                            {topMovies.map((movie, index) => (
                                <div key={movie._id} className={styles.movieCard}>
                                    <img className={styles.movieImage}
                                    src={movie.image ? movie.image.startsWith('data:image') ? movie.image: require(`../assets/${movie.image}`): defaultPlaceholder}
                                          alt={movie.name}
                                        onClick={() => navigate(`/movie-details/${movie._id}`, { state: { movie } })} />
                                    <div className={styles.movieDetails}>
                                        <p>{index + 1}. {movie.name} - {movie.boxOfficeGross}$</p>
                                        {user?.role === "user" && (
                                            <div className={styles.heart}>
                                                <FaHeart
                                                    style={{ cursor: "pointer", color: favorites.includes(movie._id) ? "red" : "gray" }}
                                                    onClick={() => toggleFavorite(movie)}/>
                                                <Rating key={movie._id} initialRating={ratings[movie._id] || 0}
                                                    onChange={(newRating) => handleRatingChange(newRating, movie._id)} emptySymbol={<FaRegStar />}
                                                    fullSymbol={<FaStar color="gold" />}/>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Movies;


