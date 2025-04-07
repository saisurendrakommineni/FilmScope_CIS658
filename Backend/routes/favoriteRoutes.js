const express = require("express");
const { addFavorite, removeFavorite, getFavorites } = require("../controllers/favoriteController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, getFavorites);
router.post("/add/:movieId", verifyToken, addFavorite);
router.delete("/remove/:movieId", verifyToken, removeFavorite);

module.exports = router;
