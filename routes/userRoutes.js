const express = require("express");
const router = express.Router();
const { registerUser , loginUser , currentUserInfo } = require("../controllers/userController");
const validateToken = require("../middlewares/validateTokenHandler");


router.post("/register",registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUserInfo);

module.exports = router;