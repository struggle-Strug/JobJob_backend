const Admin = require("../../Models/AdminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {
        const { loginId, password } = req.body;

        // Find the admin by loginId
        const admin = await Admin.findOne({ loginId: loginId });
        if (!admin) {
            return res.json({ message: "ログインIDが存在しません", error: true });
        }

        // Compare the provided password with the hashed password
        const isPasswordMatch = await bcrypt.compare(password, admin.password);
        if (!isPasswordMatch) {
            return res.json({ message: "パスワードが間違っています", error: true });
        }

        const token = jwt.sign({ id: admin._id }, process.env.SECRET, { expiresIn: '3d' });

        // Success response
        return res.status(200).json({ message: "ログイン成功", token: `JWT ${token}` });

    } catch (error) {
        console.error("Error during login:", error);
        return res.json({ message: "サーバーエラー", error: true });
    }
};

exports.tokenlogin = async (req, res) => {
    try {
        const token = jwt.sign({ id: req.admin._id }, process.env.SECRET, { expiresIn: '3d' });
        return res.status(200).json({ message: "ログイン成功", token: `JWT ${token}` });
    } catch (error) {
        return res.json({ message: "サーバーエラー", error: true });
    }
};
