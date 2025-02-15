const router = require("express").Router();
const requireAuth = require("../Middleware/RequireAuth");
const messageController = require("../Controllers/messageController");

router.post("/send", requireAuth, messageController.send);
router.post("/", requireAuth, messageController.save);
router.put("/:id", requireAuth, messageController.updateMessage);
router.get("/user/:id", requireAuth, messageController.getMine);
router.get(
  "/alljobNumbers",
  requireAuth,
  messageController.getAllJobNumbersByStatus
);
router.get("/jobNumbers", requireAuth, messageController.getJobNumbersByStatus);
router.get("/detail/:id", requireAuth, messageController.getById);
router.get("/:id/:status", requireAuth, messageController.getByStatus);
router.get("/:status", requireAuth, messageController.getAllByStatus);
module.exports = router;
