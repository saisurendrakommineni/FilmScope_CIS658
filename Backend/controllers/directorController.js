const Director = require("../models/Director");

const getDirector = async (req, res) => {
    try 
    {
        const director = await Director.findOne({ name: req.params.directorName });
        if (!director) return res.status(404).json({ message: "Director not found" });
        res.json(director);
    } 
    catch (error) 
    {
        res.status(500).json({ message: "Server error", error });
    }
};

const addDirector = async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Only admins can add directors." });
    }

    const { name, details } = req.body;
    try 
    {
        let director = await Director.findOne({ name });

        if (director) {
            director.details.push(...details);
        } else {
            director = new Director({ name, details });
        }

        await director.save();
        res.status(201).json({ message: "Director details saved", director });
    } 
    catch (error) 
    {
        res.status(500).json({ message: "Server error", error });
    }
};

const updateDirector = async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Only admins can update directors." });
    }

    const { directorName, detailIndex } = req.params;
    const { label, value } = req.body;

    try 
    {
        const director = await Director.findOne({ name: directorName });
        if (!director) return res.status(404).json({ message: "Director not found" });

        if (director.details[detailIndex]) {
            director.details[detailIndex] = { label, value };
            await director.save();
            res.json({ message: "Director detail updated", director });
        } else {
            res.status(400).json({ message: "Detail index out of range" });
        }
    } 
    catch (error) 
    {
        res.status(500).json({ message: "Server error", error });
    }
};

const deleteDirector = async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Only admins can delete directors." });
    }

    try 
    {
        const director = await Director.findOneAndDelete({ name: req.params.directorName });
        if (!director) return res.status(404).json({ message: "Director not found" });

        res.json({ message: "Director deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


const deleteDirectorDetail = async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Only admins can delete director details." });
    }

    const { directorName, detailIndex } = req.params;

    try 
    {
        const director = await Director.findOne({ name: directorName });
        if (!director) return res.status(404).json({ message: "Director not found" });

        if (director.details.length > detailIndex) {
            director.details.splice(detailIndex, 1);
            await director.save();
            res.json({ message: "Director detail deleted", director });
        } else {
            res.status(400).json({ message: "Invalid detail index" });
        }
    } 
    catch (error) 
    {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { getDirector, addDirector, updateDirector, deleteDirector, deleteDirectorDetail };
