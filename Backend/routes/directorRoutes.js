

const express = require("express");
const { getDirector,addDirector,updateDirector,deleteDirector,deleteDirectorDetail } = require("../controllers/directorController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:directorName", getDirector);  
router.post("/add", verifyToken, verifyAdmin, addDirector);  
router.put("/update/:directorName/:detailIndex", verifyToken, verifyAdmin, updateDirector);  
router.delete("/delete/:directorName", verifyToken, verifyAdmin, deleteDirector);  
router.delete("/delete-detail/:directorName/:detailIndex", verifyToken, verifyAdmin, deleteDirectorDetail); 

module.exports = router;

