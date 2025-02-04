const router = require("express").Router();
const requireAuth = require("../Middleware/RequireAuth");
const messageController = require("../Controllers/messageController")

router.post("/send", requireAuth, messageController.send);
router.post("/", requireAuth, messageController.save);
router.put("/:id", requireAuth, messageController.updateMessage);
router.get("/user/:id", requireAuth, messageController.getMine);
router.get("/jobNumbers", requireAuth, messageController.getJobNumbersByStatus);
router.get("/:id/:status", requireAuth, messageController.getByStatus);
router.get("/:id", requireAuth, messageController.getById);
module.exports = router;