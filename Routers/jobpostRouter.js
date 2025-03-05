const router = require("express").Router();
const jobPostController = require("../Controllers/jobPostController");
const requireAuth = require("../Middleware/RequireAuth");

router.post("/pending/:id", requireAuth, jobPostController.pendingJobPost);
router.post("/allow/:id", requireAuth, jobPostController.allowJobPost);
router.post("/copy/:id", requireAuth, jobPostController.createJobPostByCopy);
router.post("/filter", jobPostController.getFilteredJobPosts);
router.put("/:id", requireAuth, jobPostController.updateJobPost);
router.post("/", requireAuth, jobPostController.createJobPost);
router.post("/favouriteorrecent", requireAuth, jobPostController.getFavourites);
router.get(
  "/facility/:id",
  requireAuth,
  jobPostController.getJobPostByFacilityId
);
router.get("/:id", requireAuth, jobPostController.getJobPostById);
router.get("/", requireAuth, jobPostController.getJobPosts);

module.exports = router;
