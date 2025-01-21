const router = require("express").Router();
const jobPostController = require("../Controllers/jobPostController");
const requireAuth = require("../Middleware/RequireAuth");

router.post("/", requireAuth, jobPostController.createJobPost);
router.post("/allow/:id", requireAuth, jobPostController.allowJobPost);
router.get("/", requireAuth, jobPostController.getJobPosts);
router.get("/:id", requireAuth, jobPostController.getJobPost);

module.exports = router;