const router = require("express").Router();
const requireAuth = require("../middleware/requireAuth");

const photoController = require("../Controllers/photoController/index");

router.post("/", requireAuth, photoController.save);
router.put("/:id", requireAuth, photoController.updateDescription);
router.get("/", requireAuth, photoController.getPhotosByCustomerId);

module.exports = router;
