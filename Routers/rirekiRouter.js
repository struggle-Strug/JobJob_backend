const express = require("express");
const router = express.Router();
const requireAuth = require("../Middleware/RequireAuth");
const rirekiCtr = require("../Controllers/rirekiController/rirekiCtr");


router.post("/", requireAuth, rirekiCtr.create)
router.post("/update/all/:id", requireAuth, rirekiCtr.updateAll)
router.post("/update/basic/:id", requireAuth, rirekiCtr.updateBasic)
router.post("/update/education/:id", requireAuth, rirekiCtr.updateEdu)
router.post("/update/work_history/:id", requireAuth, rirekiCtr.updateWorkHistory)
router.post("/update/qualification/:id", requireAuth, rirekiCtr.updateQualification)
router.post("/update/other/:id", requireAuth, rirekiCtr.updateOther)
router.post("/update/desire/:id", requireAuth, rirekiCtr.updateDesire)
router.post("/update/date/:id", requireAuth, rirekiCtr.updateDate)
router.get("/:id", requireAuth, rirekiCtr.getRireki)
router.get("/all/:id", requireAuth, rirekiCtr.getAllRirekis)

module.exports = router;