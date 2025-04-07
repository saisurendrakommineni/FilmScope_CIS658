const express = require("express");
const {registerUser,loginUser,resetPassword,checkEmailExists} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);
router.post("/check-email", checkEmailExists);

module.exports = router;
