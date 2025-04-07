const express = require("express");
const {addMovie,getAllMovies,deleteMovie,updateMovie,getMovieById} = require("../controllers/movieController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", verifyToken, verifyAdmin, addMovie);
router.get("/all", getAllMovies);
router.delete("/delete/:id", verifyToken, verifyAdmin, deleteMovie);
router.put("/update/:id", verifyToken, verifyAdmin, updateMovie);
router.get("/:id", getMovieById);

module.exports = router;
