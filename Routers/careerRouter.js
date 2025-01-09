const express = require("express");
const router = express.Router();
const requireAuth = require("../Middleware/RequireAuth");
const careerCtr = require("../Controllers/careerController/careerCtr");

router.post("/", requireAuth, careerCtr.create)
router.post("/delete/:id", requireAuth, careerCtr.deleteCareer)
router.put("/update/:id", requireAuth, careerCtr.update)
router.get("/:id", requireAuth, careerCtr.getOne)
router.get("/all/:id", requireAuth, careerCtr.getAll)

module.exports = router;