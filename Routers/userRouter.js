const router = require("express").Router();



const UserCtr = require("../Controllers/userController/UserCtr");

router.post("/", UserCtr.register);

module.exports = router;
9