const router = require("express").Router();
const requireAuth = require("../Middleware/requireAuth");
const customersController = require("../Controllers/customersController");

router.post("/signup", requireAuth, customersController.signup);
router.post("/signin", requireAuth, customersController.signin);
router.post("/users", requireAuth, customersController.addUser);
router.put("/email/:id", requireAuth, customersController.updateEmail);
router.put("/password/:id", requireAuth, customersController.updatePassword);
router.delete("/users/:id", requireAuth, customersController.deleteUser);
router.get("/tokenlogin", requireAuth, customersController.tokenlogin);
router.get("/users", requireAuth, customersController.getUsers);
router.get("/all", requireAuth, customersController.getAllCustomers);
router.get("/:id", requireAuth, customersController.getCustomerById);
module.exports = router;
