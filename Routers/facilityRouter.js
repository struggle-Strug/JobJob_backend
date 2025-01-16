const router = require("express").Router();
const facilityController = require("../Controllers/facilityController");
const requireAuth = require("../Middleware/RequireAuth");

router.post("/", requireAuth, facilityController.createFacility);
router.get("/", requireAuth, facilityController.getFacilities);
router.get("/:id", requireAuth, facilityController.getFacility);

module.exports = router;