const router = require("express").Router();
const memberSettingCtr = require("../Controllers/memberSettingController/memberSettingCtr");

router.post("/notification/:id", memberSettingCtr.updateNotification);
router.post("/email/:id", memberSettingCtr.updateEmail);
router.post("/password/:id", memberSettingCtr.updatePassword);
router.post("/stop/:id", memberSettingCtr.updateStopService);
module.exports = router;