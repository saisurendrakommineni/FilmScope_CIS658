const mongoose = require("mongoose");

const directorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    details: [
        {
            label: { type: String, required: true },
            value: { type: String, required: true },
        }
    ]
});

const Director = mongoose.model("Director", directorSchema);
module.exports = Director;
