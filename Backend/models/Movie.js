const mongoose = require('mongoose');
const Rating = require("./Rating"); // Import Rating model


const movieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    industry: { type: String, required: true },
    director: { type: String, required: true },
    actor: { type: String, required: true },
    budget: { type: String, required: true },
    boxOfficeGross: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },  
    castAndCrew: [
        {
            role: { type: String },  
            name: { type: String }   
        }
    ]});

    movieSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
        try {
            await Rating.deleteMany({ movie: this._id }); // delete all ratings for this movie
            next();
        } catch (error) {
            next(error);
        }
    });

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
