const Actor = require("../models/Actor");

const getActor = async (req, res) => {
    try 
    {
        const actor = await Actor.findOne({ name: req.params.actorName });
        if (!actor) return res.status(404).json({ message: "Actor not found" });
        res.json(actor);
    } 
    catch (error) 
    {
        res.status(500).json({ message: "Server error", error });
    }
};

const addActor = async (req, res) => {
    // console.log("user:", req.user);
    if (req.user.role !== "admin") 
    {
        return res.status(403).json({ message: "Unauthorized: Only admins can add actors." });
    }

    const { name, details } = req.body;
    try 
    {
        let actor = await Actor.findOne({ name });

        if (actor) {
            actor.details.push(...details);
        } 
        else {
            actor = new Actor({ name, details });
        }

        await actor.save();
        res.status(201).json({ message: "Actor details saved", actor });
    } 
    catch (error) 
    {
        res.status(500).json({ message: "Server error", error });
    }
};

const updateActor = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Only admins can update actors." });
    }

    const { actorName, detailIndex } = req.params;
    const { label, value } = req.body;

    try 
    {
        const actor = await Actor.findOne({ name: actorName });
        if (!actor) return res.status(404).json({ message: "Actor not found" });

        if (actor.details[detailIndex]) {
            actor.details[detailIndex] = { label, value };
            await actor.save();
            res.json({ message: "Actor detail updated", actor });
        } else {
            res.status(400).json({ message: "Detail index out of range" });
        }
    } 
    catch (error)
    {
        res.status(500).json({ message: "Server error", error });
    }
};

const deleteActor = async (req, res) => {
    if (req.user.role !== "admin") 
    {
        return res.status(403).json({ message: "Unauthorized: Only admins can delete actors." });
    }

    try 
    {
        const actor = await Actor.findOneAndDelete({ name: req.params.actorName });
        if (!actor) return res.status(404).json({ message: "Actor not found" });

        res.json({ message: "Actor deleted successfully" });
    } 
    catch (error) 
    {
        res.status(500).json({ message: "Server error", error });
    }
};

const deleteActorDetail = async (req, res) => {
    if (req.user.role !== "admin") 
    {
        return res.status(403).json({ message: "Unauthorized: Only admins can delete actor details." });
    }

    const { actorName, detailIndex } = req.params;

    try 
    {
        const actor = await Actor.findOne({ name: actorName });
        if (!actor) return res.status(404).json({ message: "Actor not found" });

        if (actor.details.length > detailIndex) {
            actor.details.splice(detailIndex, 1);
            await actor.save();
            res.json({ message: "Actor detail deleted", actor });
        } else {
            res.status(400).json({ message: "Invalid detail index" });
        }
    } 
    catch (error) 
    {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { getActor, addActor, updateActor, deleteActor, deleteActorDetail };

