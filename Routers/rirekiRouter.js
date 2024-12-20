const express = require("express");
const router = express.Router();
const requireAuth = require("../Middleware/RequireAuth");
const rirekiCtr = require("../Controllers/rirekiController/rirekiCtr");


router.post("/", requireAuth, rirekiCtr.create)
router.post("/update/basic/:id", requireAuth, rirekiCtr.update)
router.get("/:id", requireAuth, rirekiCtr.getRireki)
router.get("/all/:id", requireAuth, rirekiCtr.getAllRirekis)

module.exports = router;