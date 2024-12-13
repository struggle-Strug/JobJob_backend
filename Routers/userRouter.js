const router = require("express").Router();
const requireAuth = require("../Middleware/RequireAuth");

const UserCtr = require("../Controllers/userController/UserCtr");

router.post("/", UserCtr.register);
router.post("/login", UserCtr.login);
router.post("/:id/update", requireAuth, UserCtr.update);
router.get("/tokenlogin", requireAuth, UserCtr.tokenlogin);

module.exports = router;