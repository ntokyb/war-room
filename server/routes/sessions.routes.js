// .NET equivalent: ApiController with [Route("api/sessions")]

const express = require("express");
const {
  createSession,
  getSummary,
  getDashboard,
} = require("../controllers/sessionController");
const requireApiKey = require("../middleware/requireApiKey");

const router = express.Router();

router.post("/", requireApiKey, createSession);
router.get("/summary", getSummary);
router.get("/dashboard", getDashboard);

module.exports = router;
