const mongoose = require("mongoose");

const actorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    details: [
        {
            label: { type: String, required: true },
            value: { type: String, required: true },
        }
    ]
});

const Actor = mongoose.model("Actor", actorSchema);
module.exports = Actor;
