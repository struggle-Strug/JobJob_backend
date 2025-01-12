const Customer = require("../../Models/Customer");

exports.signup = async (req, res) => {
    try {
        const newCustomer = new Customer({
            companyName: req.body.companyName,
            huriganaCompanyName: req.body.huriganaCompanyName,
            contactPerson: req.body.contactPerson,
            huriganaContactPerson: req.body.huriganaContactPerson,
            phoneNumber: req.body.phoneNumber,
        email: req.body.email
    });
    await newCustomer.save();
        res.status(200).json({message: "新規登録が完了しました。", customer: newCustomer});
    } catch (error) {
        res.status(500).json({message: "サーバーエラー", error: true});
    }
}

exports.signin = async (req, res) => {
    try {
        const customer = await Customer.findOne({email: req.body.email});
        if(!customer) return res.json({message: "ユーザーが見つかりません。", error: true});

        const isMatch = await bcrypt.compare(req.body.password, customer.password);
        if(!isMatch) return res.json({message: "パスワードが間違っています。", error: true});

        const token = jwt.sign({id: customer._id}, process.env.SECRET, {expiresIn: "30d"});
        return res.status(200).json({message: "ログイン成功!", token: `JWT ${token}`, customer: customer});
    } catch (error) {
        res.status(500).json({message: "サーバーエラー", error: true});
    }
}
