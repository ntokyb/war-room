const express = require("express");
const { status, login, logout } = require("../controllers/authController");

const router = express.Router();

router.get("/auth/status", status);
router.post("/auth/login", login);
router.post("/auth/logout", logout);

module.exports = router;
