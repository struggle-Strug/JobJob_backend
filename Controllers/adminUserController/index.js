const Admin = require("../../Models/AdminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CustomerModel = require("../../Models/CustomerModel");
exports.login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    const admin = await Admin.findOne({ loginId });
    if (!admin) {
      return res
        .status(401)
        .json({ message: "ログインIDが存在しません", error: true });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.json({ message: "パスワードが間違っています", error: true });
    }

    const token = jwt.sign({ id: admin._id }, process.env.SECRET, {
      expiresIn: "3d",
    });

    return res
      .status(200)
      .json({ message: "ログイン成功", token: `JWT ${token}` });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.loginAsCustomer = async (req, res) => {
  try {
    const customer_id = req.params.id;
    const customer = await CustomerModel.findOne({ customer_id: customer_id });
    const token = jwt.sign({ id: customer._id }, process.env.SECRET, {
      expiresIn: "30d",
    });
    const formattedToken = `JWT ${token}`;
    const adminPanelURL = `http://${process.env.FRONTEND_URL}/customers/sign_in?token=${formattedToken}`;
    // Success response
    return res
      .status(200)
      .json({ message: "ログイン成功", url: adminPanelURL });
  } catch (error) {
    return res.json({ message: "サーバーエラー", error: true });
  }
};

exports.tokenlogin = async (req, res) => {
  try {
    const token = jwt.sign({ id: req.admin._id }, process.env.SECRET, {
      expiresIn: "3d",
    });
    return res
      .status(200)
      .json({ message: "ログイン成功", token: `JWT ${token}` });
  } catch (error) {
    return res.json({ message: "サーバーエラー", error: true });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admin.findByIdAndUpdate({ _id: id }, req.body);

    return res
      .status(200)
      .json({ message: "アップデート成功", loginId: admin.loginId });
  } catch (error) {
    console.log(error);

    return res.json({ message: "サーバーエラー", error: true });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res
        .status(404)
        .json({ message: "管理者が見つかりません", error: true });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.json({ message: "パスワードが一致しません", error: true });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: "パスワード更新成功" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};
