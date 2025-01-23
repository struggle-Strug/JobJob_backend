const router = require("express").Router();
const jobPostController = require("../Controllers/jobPostController");
const requireAuth = require("../Middleware/RequireAuth");

router.post("/", requireAuth, jobPostController.createJobPost);
router.post("/pending/:id", requireAuth, jobPostController.pendingJobPost);
router.post("/allow/:id", requireAuth, jobPostController.allowJobPost);
router.put("/:id", requireAuth, jobPostController.updateJobPost);
router.get("/", requireAuth, jobPostController.getJobPosts);
router.get("/:id", requireAuth, jobPostController.getJobPostById);
router.get("/facility/:id", requireAuth, jobPostController.getJobPostByFacilityId);

module.exports = router;