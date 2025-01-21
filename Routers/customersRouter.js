const router = require("express").Router();
const customersController = require("../Controllers/customersController");

router.post("/signup", customersController.signup);
router.post("/signin", customersController.signin);
router.get("/tokenlogin", customersController.tokenlogin);
router.get("/all", customersController.getAllCustomers);
module.exports = router;