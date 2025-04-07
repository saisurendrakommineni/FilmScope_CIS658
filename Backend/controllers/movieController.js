
const Movie = require('../models/Movie');
const Rating = require("../models/Rating"); 
const Favorite = require("../models/Favorite"); 
const Actor = require("../models/Actor"); 
const Director = require("../models/Director"); 

const mongoose = require('mongoose');

exports.addMovie = async (req, res) => {
    try 
    {
        const { name, industry, director, actor, budget,boxOfficeGross, year, genre, description, image, castAndCrew } = req.body;

        if (!Array.isArray(castAndCrew)) {
            return res.status(400).json({ message: "Invalid castAndCrew format. Must be an array." });
        }

        const existingMovie = await Movie.findOne({ name,
            industry,
            director,
            actor,
            budget,
            boxOfficeGross,
            year,
            genre,});

        if (existingMovie) {
            return res.status(400).json({ message: "Movie already exists with the same details" });
        }

        const newMovie = new Movie({
            name,
            industry,
            director,
            actor,
            budget,
            boxOfficeGross,
            year,
            genre,
            description,
            image,
            castAndCrew
        });

        await newMovie.save();
        res.status(201).json({ message: "Movie added successfully", movie: newMovie });
    } 
    catch (error) 
    {
        console.error("Error adding movie:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllMovies = async (req, res) => {
    try 
    {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } 
    catch (error) 
    {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id.length !== 24) {
            return res.status(400).json({ message: "Invalid movie ID" });
        }

        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        await Rating.deleteMany({ movie: id });

        await Favorite.updateMany({ movies: id }, { $pull: { movies: id } });

        // Conditionally delete actor
        const actorMovieCount = await Movie.countDocuments({ actor: movie.actor });
        if (actorMovieCount <= 1) {
            await Actor.deleteOne({ name: movie.actor });
        }

        // Conditionally delete director
        const directorMovieCount = await Movie.countDocuments({ director: movie.director });
        if (directorMovieCount <= 1) {
            await Director.deleteOne({ name: movie.director });
        }

        // Finally delete the movie
        await Movie.deleteOne({ _id: id });

        res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
        console.error("Error deleting movie:", error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.updateMovie = async (req, res) => {
    try 
    {
        const { id } = req.params;
        const updatedData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid movie ID format" });
        }

        const existingMovie = await Movie.findOne({
            name: updatedData.name,
            industry: updatedData.industry,
            director: updatedData.director,
            actor: updatedData.actor,
            budget: updatedData.budget,
            boxOfficeGross: updatedData.boxOfficeGross,
            year: updatedData.year,
            genre: updatedData.genre,
            description: updatedData.description,
            _id: { $ne: id } 
        });

        if (existingMovie) {
            return res.status(400).json({ message: "A movie with the same details already exists" });
        }

        const updatedMovie = await Movie.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(200).json({ message: "Movie updated successfully", movie: updatedMovie });
    } 
    catch (error) 
    {
        console.error("Error updating movie:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getMovieById = async (req, res) => {
    try 
    {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid movie ID format" });
        }

        const movie = await Movie.findById(id);

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(200).json(movie);
    } 
    catch (error) 
    {
        console.error("Error fetching movie details:", error);
        res.status(500).json({ message: "Server error" });
    }
};
