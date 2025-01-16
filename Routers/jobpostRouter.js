const router = require("express").Router();
const jobPostController = require("../Controllers/jobPostController");
const requireAuth = require("../Middleware/RequireAuth");

router.post("/", requireAuth, jobPostController.createJobPost);
router.get("/:id", requireAuth, jobPostController.getJobPosts);

module.exports = router;