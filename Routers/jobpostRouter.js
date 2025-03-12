const router = require("express").Router();
const jobPostController = require("../Controllers/jobPostController");
const requireAuth = require("../Middleware/RequireAuth");

router.post("/:id/:status", requireAuth, jobPostController.updateJobPostStatus);
router.post("/copy/:id", requireAuth, jobPostController.createJobPostByCopy);
router.post("/filter", jobPostController.getFilteredJobPosts);
router.put("/:id", requireAuth, jobPostController.updateJobPost);
router.post("/", requireAuth, jobPostController.createJobPost);
router.post("/favouriteorrecent", requireAuth, jobPostController.getFavourites);
router.get("/facility/:id", jobPostController.getJobPostByFacilityId);
router.get("/applied", requireAuth, jobPostController.getAppliedJobPosts);
router.get("/:id", jobPostController.getJobPostById);
router.get("/", requireAuth, jobPostController.getJobPosts);

module.exports = router;
