// const express = require("express");
// const { getActor, addActor, updateActor, deleteActor, deleteActorDetail } = require("../controllers/actorController");

// const router = express.Router();

// router.get("/:actorName", getActor);  // Fetch actor details
// router.post("/add", addActor);  // Add new actor details
// router.put("/update/:actorName/:detailIndex", updateActor);  // Update specific actor detail
// router.delete("/delete/:actorName", deleteActor);  // Delete entire actor entry
// router.delete("/delete-detail/:actorName/:detailIndex", deleteActorDetail); // Delete specific actor detail

// module.exports = router;

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


