const express = require("express");
const { create, list, remove } = require("../controllers/guestUsersController");

const router = express.Router();

router.post("/", create);
router.get("/", list);
router.delete("/:username", remove);

module.exports = router;
