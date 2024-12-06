const User = require("../../Models/UserModel");
const bcrypt = require("bcrypt");

exports.register =  async(req, res) => {
    try{
        const user =await User.findOne({ email: req.body.email});
        if(user){
            return res.json({ message: "既に登録済みのユーザーです。", error: true });
        }
        const newUser = new User(req.body);
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(req.body.password, salt);

        await newUser.save();
        return res.status(201).json({ message: "登録成功!", user: newUser });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: true });
    }
}
