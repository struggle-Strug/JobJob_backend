const router = require("express").Router();
const facilityController = require("../Controllers/facilityController");
const requireAuth = require("../Middleware/RequireAuth");

router.post(
  "/:id/:status",
  requireAuth,
  facilityController.updateFacilityStatus
);
router.post("/", requireAuth, facilityController.createFacility);
router.put("/:id", requireAuth, facilityController.updateFacility);
router.delete("/:id", requireAuth, facilityController.deleteFacility);
router.get("/getByCompany", requireAuth, facilityController.getByCompany);
router.get("/request", requireAuth, facilityController.getPendingFacilities);
router.get("/customer", requireAuth, facilityController.getCustomerFacilties);
router.get("/all", facilityController.getAllFacilities);
router.get("/:id", facilityController.getFacility);
router.get("/", facilityController.getFacilities);

module.exports = router;
