const UserModel = require("../../Models/UserModel");
const bcrypt = require("bcrypt");
exports.updateNotification = async (req, res) => {
    try {
        const { notificationEmail, message, newJob, recommendJob } = req.body;
        const { id } = req.params;
        const member = await UserModel.findById(id);
        member.setting.notificationEmail = notificationEmail;
        member.setting.message = message;
        member.setting.newJob = newJob;
        member.setting.recommendJob = recommendJob;
        await member.save();
        res.status(200).json({ message: "通知設定更新成功", setting: member.setting });
    } catch (error) {
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.updateEmail = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;
        const member = await UserModel.findById(id);
        member.email = email;
        await member.save();
        res.status(200).json({ message: "メールアドレス更新成功", email: member.email });
    } catch (error) {
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;
        const member = await UserModel.findById(id);
        const isMatch = await bcrypt.compare(currentPassword, member.password);
        if(!isMatch) {
            return res.json({ message: "パスワードが一致しません", error: true });
        }
        const salt = await bcrypt.genSalt(10);
        member.password = await bcrypt.hash(newPassword, salt);

        await member.save();
        res.status(200).json({ message: "パスワード更新成功" });
    } catch (error) {
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.updateStopService = async (req, res) => {
    try {
        const { id } = req.params;
        const { notificationEmail, message, newJob, recommendJob } = req.body;
        const member = await UserModel.findById(id);
        member.setting.notificationEmail = notificationEmail;
        member.setting.message = message;
        member.setting.newJob = newJob;
        member.setting.recommendJob = recommendJob;
        await member.save();
        res.status(200).json({ message: "ジョブジョブからの連絡を停止しました" });
    } catch (error) {
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}
