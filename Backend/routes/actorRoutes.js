const express = require("express");
const { getActor, addActor, updateActor, deleteActor, deleteActorDetail } = require("../controllers/actorController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:actorName", getActor);  
router.post("/add", verifyToken, verifyAdmin, addActor);  
router.put("/update/:actorName/:detailIndex", verifyToken, verifyAdmin, updateActor);  
router.delete("/delete/:actorName", verifyToken, verifyAdmin, deleteActor);  
router.delete("/delete-detail/:actorName/:detailIndex", verifyToken, verifyAdmin, deleteActorDetail);
module.exports = router;


