const Rireki = require("../../Models/RirekiModel");

exports.create = async (req, res) => {
    try {
        const newRireki = new Rireki({
            title: req.body.title,
            user: req.body.user,
            basic: req.body.basic,
            education: req.body.education,
            workhistory: req.body.workhistory,
            qualification: req.body.qualification,
            other: req.body.other,
            desire: req.body.desire,
            creationDate: req.body.creationDate
        })
        await newRireki.save();
        return res.status(200).json({ message: "履歴書作成成功!", rireki: newRireki });
    } catch (error) {
        return res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.getRireki = async (req, res) => {
    try {
        const rireki = await Rireki.findById(req.params.id);
        return res.status(200).json({ rireki: rireki });
    } catch (error) {
        return res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.getAllRirekis = async (req, res) => {
    try {
        const rirekis = await Rireki.find({ user: req.params.id });
        return res.status(200).json({ rirekis: rirekis });
    } catch (error) {
        return res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.updateAll = async (req, res) => {
    try {
        const rireki = await Rireki.findById(req.params.id);
        rireki.basic = req.body.basic;
        rireki.education = req.body.education;
        rireki.workhistory = req.body.workhistory;
        rireki.qualification = req.body.qualification;
        rireki.other = req.body.other;
        rireki.desire = req.body.desire;
        await rireki.save();
        return res.status(200).json({ message: "履歴書更新成功!", rireki: rireki });
    } catch (error) {
        return res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.updateBasic = async (req, res) => {
    try {
        const rireki = await Rireki.findById(req.params.id);
        rireki.basic = req.body;
        await rireki.save();
        return res.status(200).json({ message: "履歴書更新成功!", rireki: rireki });
    } catch (error) {
        return res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.updateEdu = async (req, res) => {
    try {
        const rireki = await Rireki.findById(req.params.id);
        rireki.education = req.body;
        await rireki.save();
        return res.status(200).json({ message: "履歴書更新成功!", rireki: rireki });
    } catch (error) {
        return res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.updateWorkHistory = async (req, res) => {
    try {
        const rireki = await Rireki.findById(req.params.id);
        rireki.workhistory = req.body;
        await rireki.save();
        return res.status(200).json({ message: "履歴書更新成功!", rireki: rireki });
    } catch (error) {
        return res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.updateQualification = async (req, res) => {
    try {
        const rireki = await Rireki.findById(req.params.id);
        rireki.qualification = req.body;
        await rireki.save();
        return res.status(200).json({ message: "履歴書更新成功!", rireki: rireki });
    } catch (error) {
        return res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.updateOther = async (req, res) => {
    try {
        const rireki = await Rireki.findById(req.params.id);
        rireki.other = req.body;
        await rireki.save();
        return res.status(200).json({ message: "履歴書更新成功!", rireki: rireki });
    } catch (error) {
        return res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.updateDesire = async (req, res) => {
    try {
        const rireki = await Rireki.findById(req.params.id);
        rireki.desire = req.body;
        await rireki.save();
        return res.status(200).json({ message: "履歴書更新成功!", rireki: rireki });
    } catch (error) {
        return res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.updateDate = async (req, res) => {
    try {
        const rireki = await Rireki.findById(req.params.id);
        rireki.creationDate = req.body.creationDate;
        await rireki.save();
        return res.status(200).json({ message: "履歴書更新成功!", rireki: rireki });
    } catch (error) {
        return res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.deleteRireki = async (req, res) => {
    try {
        const rireki = await Rireki.findOne({ user: req.params.id});
        await rireki.deleteOne();
        return res.status(200).json({ message: "削除成功!", rireki: rireki });
    } catch (error) {
        return res.status(500).json({ message: "サーバーエラー", error: true });
    }
}
