const router = require("express").Router();
const requireAuth = require("../Middleware/RequireAuth");

const photoController = require("../Controllers/photoController/index");

router.post("/", requireAuth, photoController.save);
router.delete(
  "/:imageName",
  requireAuth,
  photoController.deleteImageByCustomerId
);
router.put("/image", requireAuth, photoController.updateImages);
router.put("/:id", requireAuth, photoController.updateDescription);
router.get("/", requireAuth, photoController.getPhotosByCustomerId);

module.exports = router;
