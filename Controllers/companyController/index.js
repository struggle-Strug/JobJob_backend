const companyModel = require("../../Models/companyModel");

exports.create = async (req, res) => {
  try {
    const {
      companyName,
      postalCode,
      prefecture,
      municipality,
      address,
      buildingName,
      contactPerson,
      contactPersonHurigana,
      phoneNumber,
    } = req.body;

    const company = await companyModel.findOne({ companyName: companyName });
    if (company)
      return res
        .status(400)
        .json({ message: "既に登録されています", error: true });
    const newCompany = new companyModel({
      companyName,
      postalCode,
      prefecture,
      municipality,
      address,
      buildingName,
      contactPerson,
      contactPersonHurigana,
      phoneNumber,
    });

    await newCompany.save();
    return res.status(200).json({ message: "登録完了", company: newCompany });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "サーバーエラ", error: true });
  }
};

exports.getCompanyInfo = async (req, res) => {
  try {
    const companyName = req.params.companyName;
    const company = await companyModel.findOne({ companyName: companyName });
    if (!company)
      return res
        .status(400)
        .json({ message: "登録されていません", error: true });
    return res.status(200).json({ company: company });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "サーバーエラ", error: true });
  }
};
