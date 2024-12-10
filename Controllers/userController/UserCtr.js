const User = require("../../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

exports.login = async (req, res) => {
    try{
        const user = await User.findOne({ email: req.body.email });
        if(!user) return res.status(401).json({ message: "ユーザーが見つかりません。", error: true });

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isMatch) return res.status(401).json({ message: "パスワードが間違っています。", error: true });

        const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "30d" });
        return res.status(200).json({ message: "ログイン成功!", token: `JWT ${token}`, user: user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: true });
    }
}

exports.tokenlogin = async (req, res) => {
    try {
      const token = jwt.sign({ id: req.user._id }, process.env.SECRET, { expiresIn: "30d" });
      return res.status(200).json({ message: "ログイン成功!", token: `JWT ${token}`, user: req.user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

