const router = require("express").Router();
const adminUserController = require("../Controllers/adminUserController/index");

router.post("/login", adminUserController.login);
router.post("/customerlogin/:id", adminUserController.loginAsCustomer);
router.get("/tokenlogin", adminUserController.tokenlogin);
module.exports = router;
