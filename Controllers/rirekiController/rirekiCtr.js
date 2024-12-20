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
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error: true });
    }
}

exports.getRireki = async (req, res) => {
    try {
        const rireki = await Rireki.findById(req.params.id);
        return res.status(200).json({ rireki: rireki });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: true });
    }
}

exports.getAllRirekis = async (req, res) => {
    try {
        const rirekis = await Rireki.find({ user: req.params.id });
        return res.status(200).json({ rirekis: rirekis });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: true });
    }
}

exports.update = async (req, res) => {
    try {
        const rireki = await Rireki.findByIdAndUpdate(req.params.id, req.body);
        return res.status(200).json({ message: "履歴書更新成功!", rireki: rireki });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: true });
    }
}
