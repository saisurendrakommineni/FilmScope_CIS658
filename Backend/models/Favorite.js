const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }]
});

module.exports = mongoose.model("Favorite", favoriteSchema);
