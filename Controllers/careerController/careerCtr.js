const Career = require("../../Models/CareerModel");

exports.create = async (req, res) => {
    try {
        const { user, title, name, creationDate, selfPR, qualification, workHistories } = req.body;
        const career = new Career({ user, title, name, creationDate, selfPR, qualification, workHistories });
        await career.save();
        res.status(200).json({ message: "職務経歴書作成成功", career: career });
    } catch (error) {
        res.status(500).json({ message: "職務経歴書作成失敗", error });
    }
}

exports.getAll = async (req, res) => {
    try {
        const { id } = req.params;
        const careerSheets = await Career.find({ user: id });
        res.status(200).json({ message: "職務経歴書読み込み成功", careerSheets });
    } catch (error) {
        res.status(500).json({ message: "職務経歴書読み込み失敗", error });
    }
}

exports.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const careerSheet = await Career.findById(id);
        res.status(200).json({ message: "職務経歴書読み込み成功", careerSheet: careerSheet });
    } catch (error) {
        res.status(500).json({ message: "職務経歴書読み込み失敗", error });
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, title, name, creationDate, selfPR, qualification, workHistories } = req.body;
        const careerSheet = await Career.findByIdAndUpdate(id, { user, title, name, creationDate, selfPR, qualification, workHistories });
        res.status(200).json({ message: "職務経歴書更新成功", careerSheet });
    } catch (error) {
        res.status(500).json({ message: "職務経歴書更新失敗", error });
    }
}


