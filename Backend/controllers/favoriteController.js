const Favorite = require("../models/Favorite");
const Movie = require("../models/Movie");

exports.addFavorite = async (req, res) => {
    try 
    {
        const { movieId } = req.params;
        const userId = req.user.id;

        if (!movieId || movieId === "undefined") {
            return res.status(400).json({ message: "Invalid movie ID" });
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        let favorite = await Favorite.findOne({ user: userId });
        if (!favorite) {
            favorite = new Favorite({ user: userId, movies: [] });
        }

        if (favorite.movies.includes(movieId)) {
            return res.status(400).json({ message: "Movie is already in favorites" });
        }

        favorite.movies.push(movieId);
        await favorite.save();

        res.status(201).json({ message: "Movie added to favorites", favorite });
    } 
    catch (error) 
    {
        console.error("Error adding favorite:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.removeFavorite = async (req, res) => {
    try 
    {
        const { movieId } = req.params;
        const userId = req.user.id;

        const favorite = await Favorite.findOne({ user: userId });
        if (!favorite) {
            return res.status(404).json({ message: "Favorites not found" });
        }

        favorite.movies = favorite.movies.filter(id => id.toString() !== movieId);
        await favorite.save();

        res.status(200).json({ message: "Movie removed from favorites", favorite });
    } 
    catch (error)
    {
        console.error("Error removing favorite:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getFavorites = async (req, res) => {
    try 
    {
        const userId = req.user.id;
        if (userId === "admin_id") {
            return res.json([]); // Admins, no ratings
        }
        const favorite = await Favorite.findOne({ user: userId }).populate("movies");
        if (!favorite) {
            return res.json([]);
        }

        res.json(favorite.movies);
    } 
    catch (error) 
    {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ message: "Server error" });
    }
};
