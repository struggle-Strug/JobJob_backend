const router = require("express").Router();
const requireAuth = require("../Middleware/RequireAuth");

const UserCtr = require("../Controllers/userController/UserCtr");
const axios = require("axios");

router.post("/:id/update/work_history", requireAuth, UserCtr.updateWork);
router.post("/:id/update/desire", requireAuth, UserCtr.updateDesire);
router.post("/stop/:id", requireAuth, UserCtr.stop);
router.post("/:id/update", requireAuth, UserCtr.update);
router.post("/delete/:id", requireAuth, UserCtr.deleteAccount);
router.post("/login", UserCtr.login);
router.post("/forgot-password", UserCtr.forgotPassword);
router.post("/", UserCtr.register);
router.get("/tokenlogin", requireAuth, UserCtr.tokenlogin);
router.get("/all", requireAuth, UserCtr.getAll);
router.post("/forgot-password-request", UserCtr.forgotPasswordRequest);
router.post("/reset-password", UserCtr.resetPassword);

router.post("/zipsearch", async (req, res) => {
    try {
      const { zipcode } = req.body;
      if (!/^\d{7}$/.test(zipcode)) {
        return res.status(400).json({ error: "郵便番号は7桁の数字で指定してください。" });
      }
      const apiRes = await axios.get("https://zipcloud.ibsnet.co.jp/api/search", {
        params: { zipcode }
      });
      return res.json(apiRes.data);
    } catch (err) {
      console.error("ZIP 検索エラー:", err.message);
      return res.status(500).json({ error: "郵便番号検索に失敗しました。" });
    }
  });

module.exports = router;
