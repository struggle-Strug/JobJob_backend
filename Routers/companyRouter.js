const router = require("express").Router();
const companyController = require("../Controllers/companyController");
const requireAuth = require("../Middleware/RequireAuth");

router.post("/", requireAuth, companyController.create);
router.get("/:companyName", requireAuth, companyController.getCompanyInfo);

module.exports = router;
