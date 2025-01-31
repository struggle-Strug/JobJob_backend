const router = require("express").Router();
const requireAuth = require("../Middleware/RequireAuth");
const messageController = require("../Controllers/messageController")

router.post("/send", requireAuth, messageController.send);
router.post("/", requireAuth, messageController.save);
router.get("/user/:id", requireAuth, messageController.getMine);
router.get("/:id", requireAuth, messageController.getById);
module.exports = router;