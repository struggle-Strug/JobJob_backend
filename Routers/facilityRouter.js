const router = require("express").Router();
const facilityController = require("../Controllers/facilityController");
const requireAuth = require("../Middleware/RequireAuth");

router.post("/", requireAuth, facilityController.createFacility);
router.post("/pending/:id", requireAuth, facilityController.pendingFacility);
router.post("/allow/:id", requireAuth, facilityController.allowFacility);
router.put("/:id", requireAuth, facilityController.updateFacility);
router.delete("/:id", requireAuth, facilityController.deleteFacility);
router.get("/getByCompany", requireAuth, facilityController.getAllFacilities);
router.get("/all", requireAuth, facilityController.getAllFacilities);
router.get("/:id", requireAuth, facilityController.getFacility);
router.get("/", requireAuth, facilityController.getFacilities);

module.exports = router;
