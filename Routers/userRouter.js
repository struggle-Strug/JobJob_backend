const router = require("express").Router();

const UserCtr = require("../Controllers/userController/UserCtr");

router.post("/", UserCtr.register);
router.post("/login", UserCtr.login);

module.exports = router;