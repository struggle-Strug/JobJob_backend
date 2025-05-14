const User = require("../../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
exports.register = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log("REGISTER SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY?.slice(0,4) + "…");
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

    // Updated email configuration - using the verified sender email
    const msg = {
      to: req.body.email,
      from: {
        email: "noreply@jobjob-jp.com", // Using the verified email that works in your other controller
        name: "ジョブジョブ運営事務局",
      },
      subject: "［ジョブジョブ］新規会員登録完了のお知らせ",
      text: [`
    この度はジョブジョブに会員登録いただき誠にありがとうございます。
    
    ID：${req.body.email}。
    パスワード：${req.body.password}。
    
    求人検索はこちら
    http://staging.jobjob-jp.com/members/register_complete
    マイページはこちら
    http://staging.jobjob-jp.com/members/mypage
    
    本メールの送信アドレスは送信専用です。
    本メールに直接ご返信いただいてもご対応できかねますので、ご注意願います。
    
    当メールに関するお問い合わせについては下記へご連絡ください。
    
    ----------------------------------------------------------------------
    【お問い合わせ先】
    ジョブジョブ運営事務局
    お問い合わせフォーム
    http://staging.jobjob-jp.com/customers/contact/
    ----------------------------------------------------------------------
    `].join("\n"),
      html: `
    <p style="margin: 5px 0; line-height: 1.2;">この度はジョブジョブに会員登録いただき誠にありがとうございます。</p>
    <br/>
    <p style="margin: 5px 0; line-height: 1.2;">ID：<strong>ご登録のメールアドレス</strong></p>
    <br/>
    <p style="margin: 5px 0; line-height: 1.2;">パスワード：<strong>ご登録時に設定いただいたパスワード</strong></p>
    <br/>
    <p style="margin: 5px 0; line-height: 1.2;">求人検索はこちら</p>
    <p style="margin: 5px 0; line-height: 1.2;"><a href="http://staging.jobjob-jp.com/" target="_blank">http://staging.jobjob-jp.com/</a></p>
    <p style="margin: 5px 0; line-height: 1.2;">マイページはこちら</p>
    <p style="margin: 5px 0; line-height: 1.2;"><a href="http://staging.jobjob-jp.com/members/mypage" target="_blank">http://staging.jobjob-jp.com/members/mypage</a></p>
    <br/>
    <p style="margin: 5px 0; line-height: 1.2;">本メールの送信アドレスは送信専用です。</p>
    <p style="margin: 5px 0; line-height: 1.2;">本メールに直接ご返信いただいてもご対応できかねますので、ご注意願います。</p>
    <br/>
    <p style="margin: 5px 0; line-height: 1.2;">当メールに関するお問い合わせについては下記へご連絡ください。</p>
    <hr style="margin: 10px 0;"/>
    <p style="margin: 5px 0; line-height: 1.2;"><strong>----------------------------------------------------------------------
</strong></p>
    <p style="margin: 5px 0; line-height: 1.2;"><strong>【お問い合わせ先】</strong></p>
    <p style="margin: 5px 0; line-height: 1.2;">ジョブジョブ運営事務局</p>
    <p style="margin: 5px 0; line-height: 1.2;">お問い合わせフォーム</p>
    <p style="margin: 5px 0; line-height: 1.2;"><a href="http://staging.jobjob-jp.com/customers/contact/" target="_blank">http://staging.jobjob-jp.com/customers/contact/</a></p>
    <p style="margin: 5px 0; line-height: 1.2;"><strong>----------------------------------------------------------------------
</strong></p>
    `,
    };

    try {
      await sgMail.send(msg);
      console.log("Email sent successfully");
    } catch (emailError) {
      console.error("SendGrid Error:", emailError);
      // Continue with registration even if email fails
      if (emailError.response) {
        console.error("Error body:", emailError.response.body);
      }
    }

    return res.status(201).json({ message: "登録成功!", user: newUser });
  } catch (error) {
    console.log(error);
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

    if (req.body.qualification.length > 0) {
      user.qualification = req.body.qualification;
    }

    await user.save();
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
    console.error("Error in forgotPassword:", error);
    // エラーの詳細をフロントエンドに返す
    return res
      .status(500)
      .json({ message: "サーバーエラー", error: error.message });
  }
};

// controllers/userController.js
exports.forgotPasswordRequest = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("User not found for email:", req.body.email);
      return res.json({ message: "ユーザーが見つかりません。", error: true });
    }
    // トークン生成（例：1時間有効）
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "1h",
    });

    // SendGrid の API キーをセット
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: req.body.email,
      from: {
        email: "noreply@jobjob-jp.com",
        name: "ジョブジョブ運営事務局",
      },
      subject: "パスワードリセットのご案内",
      text: [`以下のリンクからパスワードリセットを行ってください:\n\nhttp://staging.jobjob-jp.com/reset-password?token=${token}`].join("\n"),
      html: `<p style="margin: 5px 0; line-height: 1.2;">以下のリンクからパスワードリセットを行ってください:</p>
             <p style="margin: 5px 0; line-height: 1.2;"><a href="http://staging.jobjob-jp.com/reset-password?token=${token}" target="_blank">パスワードリセット</a></p>`,
    };
    await sgMail.send(msg);
    return res
      .status(200)
      .json({ message: "パスワードリセット用のメールを送信しました" });
  } catch (emailError) {
    return res
      .status(500)
      .json({ message: "メール送信に失敗しました", error: emailError.response.body });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    // トークン検証
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.json({ message: "ユーザーが見つかりません。", error: true });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    return res.status(200).json({ message: "パスワードの更新に成功しました" });
  } catch (error) {
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};
