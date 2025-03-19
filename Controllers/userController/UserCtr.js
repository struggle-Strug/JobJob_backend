const User = require("../../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

exports.register = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // Set your SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    if (user) {
      return res.json({ message: "既に登録済みのユーザーです。", error: true });
    }
    const members = await User.find();
    const newUser = new User({ ...req.body, member_id: members.length + 1 });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(req.body.password, salt);

    await newUser.save();

    const msg = {
      to: req.body.email,
      from: "huskar020911@gmail.com", // Must be a verified sender on SendGrid
      subject: "施設審査結果",
      text: `差出人：ジョブジョブ運営事務局
    FROM：noreply@jobjob-jp.com
    件名：新規会員登録完了のお知らせ
    
    この度はジョブジョブに会員登録いただき誠にありがとうございます。
    
    ID：${req.body.email}。
    パスワード：${req.body.password}。
    
    求人検索はこちら
    http://142.132.202.228:3000/
    マイページはこちら
    http://142.132.202.228:3000/members/mypage
    
    本メールの送信アドレスは送信専用です。
    本メールに直接ご返信いただいてもご対応できかねますので、ご注意願います。
    
    当メールに関するお問い合わせについては下記へご連絡ください。
    
    ----------------------------------------------------------------------
    【お問い合わせ先】
    ジョブジョブ運営事務局
    お問い合わせフォーム
    http://142.132.202.228:3000/customers/contact/
    ----------------------------------------------------------------------
    `,
      html: `
            <p>差出人：ジョブジョブ運営事務局</p>
            <p>FROM：noreply@jobjob-jp.com</p>
            <p>件名：新規会員登録完了のお知らせ</p>
            <p>この度はジョブジョブに会員登録いただき誠にありがとうございます。</p>
            <p>ID：<strong>${req.body.email}</strong>。</p>
            <p>パスワード：<strong>${req.body.password}</strong>。</p>
            <p>求人検索はこちら</p>
            <p><a href="http://142.132.202.228:3000/" target="_blank">http://142.132.202.228:3000/</a></p>
            <p>マイページはこちら</p>
            <p><a href="http://142.132.202.228:3000/members/mypage" target="_blank">http://142.132.202.228:3000/members/mypage</a></p>
            <br/>
            <p>本メールの送信アドレスは送信専用です。</p>
            <p>本メールに直接ご返信いただいてもご対応できかねますので、ご注意願います。</p>
            <br/>
            <p>当メールに関するお問い合わせについては下記へご連絡ください。</p>
            <hr>
            <p><strong>【お問い合わせ先】</strong></p>
            <p>ジョブジョブ運営事務局</p>
            <p>お問い合わせフォーム</p>
            <p><a href="http://142.132.202.228:3000/customers/contact/" target="_blank">http://142.132.202.228:3000/customers/contact/</a></p>`,
    };

    await sgMail.send(msg);
    return res.status(201).json({ message: "登録成功!", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.json({ message: "ユーザーが見つかりません。", error: true });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch)
      return res.json({ message: "パスワードが間違っています。", error: true });

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "30d",
    });
    return res
      .status(200)
      .json({ message: "ログイン成功!", token: `JWT ${token}`, user: user });
  } catch (error) {
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.tokenlogin = async (req, res) => {
  try {
    const token = jwt.sign({ id: req.user._id }, process.env.SECRET, {
      expiresIn: "30d",
    });
    return res.status(200).json({
      message: "ログイン成功!",
      token: `JWT ${token}`,
      user: req.user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({ message: "更新成功!", user: user });
  } catch (error) {
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.updateWork = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.workHistories = await req.body;
    await user.save();
    return res.status(200).json({ message: "更新成功!", user: user });
  } catch (error) {
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.updateDesire = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.jobType = req.body.jobTypes;
    user.desirePrefecture = req.body.prefectures;
    user.employmentType = req.body.employmentType;
    user.employmentDate = req.body.employmentDate;
    user.desireYearSalary = req.body.yearSalary;
    user.feature = req.body.asks;
    await user.save();
    return res.status(200).json({ message: "更新成功!", user: user });
  } catch (error) {
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "削除成功!", user: user });
  } catch (error) {
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getAll = async (req, res) => {
  try {
    // Fetch only allowed users and sort by created_at in descending order
    const members = await User.find({}).sort({
      created_at: -1,
    });

    return res.status(200).json({ message: "取得成功!", members });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.stop = async (req, res) => {
  try {
    const member_id = req.params.id;
    const user = await User.findOne({ member_id: member_id });
    user.deleted = !user.deleted;
    await user.save();
    return res.status(200).json({ message: "取得成功!" });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.json({ message: "ユーザーが見つかりません。", error: true });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();

    return res.status(200).json({ message: "更新成功!" });
  } catch (error) {
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};
