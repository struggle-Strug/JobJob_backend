const Admin = require("../../Models/adminModel");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
    try {
        const { loginId, password } = req.body;

        // Find the user by loginId
        const user = await Admin.findOne({ loginId });
        if (!user) {
            return res.json({ message: "ログインIDが存在しません", error: true });
        }

        // Compare the provided password with the hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.json({ message: "パスワードが間違っています", error: true });
        }

        // Success response
        return res.status(200).json({ message: "ログイン成功" });

    } catch (error) {
        console.error("Error during login:", error);
        return res.json({ message: "サーバーエラー", error: true });
    }
};
