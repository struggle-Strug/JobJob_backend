const router = require("express").Router();
const customersController = require("../Controllers/customersController");

router.post("/signup", customersController.signup);
router.post("/signin", customersController.signin);
module.exports = router;