const router = require("express").Router();
const adminUserController = require("../Controllers/adminUserController/index");

router.post("/login", adminUserController.login);

module.exports = router;