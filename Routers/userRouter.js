const router = require("express").Router();
const requireAuth = require("../Middleware/RequireAuth");

const UserCtr = require("../Controllers/userController/UserCtr");

router.post("/:id/update/work_history", requireAuth, UserCtr.updateWork);
router.post("/:id/update/desire", requireAuth, UserCtr.updateDesire);
router.post("/stop/:id", requireAuth, UserCtr.stop);
router.post("/:id/update", requireAuth, UserCtr.update);
router.post("/delete/:id", requireAuth, UserCtr.deleteAccount);
router.post("/login", UserCtr.login);
router.post("/", UserCtr.register);
router.get("/tokenlogin", requireAuth, UserCtr.tokenlogin);
router.get("/all", requireAuth, UserCtr.getAll);

module.exports = router;
