const express = require("express");
const { rateMovie, getMovieRatings, getUserRatings } = require("../controllers/ratingController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/rate/:movieId", verifyToken, rateMovie);  
router.get("/movie/:movieId", getMovieRatings); 
router.get("/user", verifyToken, getUserRatings); 

module.exports = router;
