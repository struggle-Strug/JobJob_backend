const router = require("express").Router();
const adminUserController = require("../Controllers/adminUserController/index");

router.post("/customerlogin/:id", adminUserController.loginAsCustomer);
router.post("/login", adminUserController.login);
router.put("/pass/:id", adminUserController.updatePassword);
router.put("/:id", adminUserController.update);
router.get("/tokenlogin", adminUserController.tokenlogin);
module.exports = router;
