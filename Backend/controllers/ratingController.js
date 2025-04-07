const Rating = require("../models/Rating");
const Movie = require("../models/Movie");

exports.rateMovie = async (req, res) => {
    try 
    {
        const { movieId } = req.params;
        const { rating } = req.body;
        const userId = req.user.id;

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Invalid rating. Must be between 1 and 5." });
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        let existingRating = await Rating.findOne({ user: userId, movie: movieId });

        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
        } else {
            const newRating = new Rating({ user: userId, movie: movieId, rating });
            await newRating.save();
        }

        res.status(200).json({ message: "Rating updated successfully" });
    } 
    catch (error) 
    {
        console.error("Error updating rating:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getMovieRatings = async (req, res) => {
    try 
    {
        const { movieId } = req.params;
        const ratings = await Rating.find({ movie: movieId }).populate("user", "firstName lastName");

        res.json(ratings);
    } 
    catch (error) 
    {
        console.error("Error fetching ratings:", error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.getUserRatings = async (req, res) => {
    try 
    {
        const userId = req.user.id;

        if (userId === "admin_id") {
            return res.json([]); // Admins dont have ratings
        }

        const ratings = await Rating.find({ user: userId }).populate("movie");

        if (!ratings || ratings.length === 0) {
            return res.status(200).json([]);
        }

        const validRatings = ratings.filter(r => r.movie !== null);

        res.json(validRatings.map(r => ({ movie: r.movie._id, rating: r.rating })));
    } 
    catch (error) 
    {
        console.error("Error fetching user ratings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
