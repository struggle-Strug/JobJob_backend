const Customer = require("../../Models/CustomerModel");
const Facility = require("../../Models/FacilityModel");
const JobPost = require("../../Models/JobPostModel");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.signup = async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.body.email });
    if (customer)
      return res.json({
        message: "このメールアドレスは既に登録されています。",
        error: true,
      });

    // Set your SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const customers = await Customer.find();
    const customer_id = customers.length + 1;
    const initalPassword = await generateRandomPassword();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(initalPassword, salt);
    const newCustomer = new Customer({
      customer_id: customer_id,
      companyName: req.body.companyName,
      huriganaCompanyName: req.body.huriganaCompanyName,
      contactPerson: req.body.contactPerson,
      huriganaContactPerson: req.body.huriganaContactPerson,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      password: hashedPassword,
      initialPassword: initalPassword,
      registrationDate: new Date(),
    });
    await newCustomer.save();
    const msg = {
      to: req.body.email,
      from: "huskar020911@gmail.com", // Must be a verified sender on SendGrid
      subject: "［ジョブジョブ］パスワードのご案内",
      text: `送信元：JobJob - ジョブジョブ
    タイトル：［ジョブジョブ］パスワードのご案内
    本文：
    この度はジョブジョブへの求人掲載にお申込みいただき誠にありがとうございます。
    管理画面ご利用のためのパスワードを発行しました。
    
    パスワード：${initalPassword}
    
    下記よりログインのうえ施設情報、求人情報を入稿してください。
    http://142.132.202.228:3000/customers/sign_in
    
    本メールの送信アドレスは送信専用です。
    本メールに直接ご返信いただいてもご対応できかねますので、ご注意願います。
    
    当メールに関するお問い合わせについては下記へご連絡ください。
    
    ----------------------------------------------------------------------
    【お問い合わせ先】
    ジョブジョブ運営事務局
    お問い合わせフォーム
    http://142.132.202.228:3000/customers/contact/`,

      html: `
        <p>送信元：JobJob - ジョブジョブ</p>
        <p>この度はジョブジョブへの求人掲載にお申込みいただき誠にありがとうございます。</p>
        <p>管理画面ご利用のためのパスワードを発行しました。</p>
        <p><strong>パスワード：${initalPassword}</strong></p>
        <p>下記よりログインのうえ施設情報、求人情報を入稿してください。</p>
        <p><a href="http://142.132.202.228:3000/customers/sign_in" target="_blank">http://142.132.202.228:3000/customers/sign_in</a></p>
        <br/>
        <p>本メールの送信アドレスは送信専用です。</p>
        <p>本メールに直接ご返信いただいてもご対応できかねますので、ご注意願います。</p>
        <br/>
        <p>当メールに関するお問い合わせについては下記へご連絡ください。</p>
        <hr>
        <p><strong>【お問い合わせ先】</strong></p>
        <p>ジョブジョブ運営事務局</p>
        <p>お問い合わせフォーム</p>
        <p><a href="http://142.132.202.228:3000/customers/contact/" target="_blank">http://142.132.202.228:3000/customers/contact/</a></p>
      `,
    };

    await sgMail.send(msg);
    res
      .status(200)
      .json({ message: "新規登録が完了しました。", customer: newCustomer });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.signin = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      email: req.body.email,
      // allowed: true,
    });
    if (!customer)
      return res.json({ message: "法人が見つかりません。", error: true });
    if (customer.deleted)
      return res.json({
        message: "アクセス権が無効になりました。",
        error: true,
      });

    const isMatch = await bcrypt.compare(req.body.password, customer.password);
    if (!isMatch)
      return res.json({ message: "パスワードが間違っています。", error: true });

    const token = jwt.sign({ id: customer._id }, process.env.SECRET, {
      expiresIn: "30d",
    });
    return res.status(200).json({
      message: "ログイン成功!",
      token: `JWT ${token}`,
      customer: customer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラー", error: true });
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
      customer: req.user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ registrationDate: -1 });
    const facilities = await Facility.find({ allowed: "allowed" });
    const jobposts = await JobPost.find({ allowed: "allowed" });
    res.status(200).json({
      message: "顧客一覧取得成功",
      customers: customers,
      facilities: facilities,
      jobposts: jobposts,
    });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({ customer_id: req.params.id });
    res.status(200).json({ message: "顧客一覧取得成功", customer: customer });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id });
    customer.email = req.body.email;
    await customer.save();
    res
      .status(200)
      .json({ message: "メールアドレスを変更しました。", customer: customer });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    const customer = await Customer.findById(id);
    const isMatch = await bcrypt.compare(currentPassword, customer.password);
    if (!isMatch) {
      return res.json({ message: "パスワードが一致しません", error: true });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    customer.password = hashedPassword;

    await customer.save();
    res.status(200).json({ message: "パスワード更新成功" });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await Customer.find({
      companyName: req.user.data.companyName,
    }).sort({ createdAt: -1 });
    res.status(200).json({
      message: "ユーザー一覧取得成功",
      users: users,
    });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.addUser = async (req, res) => {
  try {
    const customers = await Customer.find();
    const lastCustomer = customers[customers.length - 1];
    const customer_id = lastCustomer ? Number(lastCustomer.customer_id) + 1 : 1;

    const newCustomer = new Customer({
      customer_id: customer_id,
      companyName: req.user.data.companyName,
      huriganaCompanyName: req.user.data.huriganaCompanyName,
      contactPerson: req.body.contactPerson,
      huriganaContactPerson: req.body.huriganaContactPerson,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      initialPassword: req.body.password,
      registrationDate: new Date(),
    });

    const salt = await bcrypt.genSalt(10);
    newCustomer.password = await bcrypt.hash(req.body.password, salt);
    await newCustomer.save();
    res
      .status(200)
      .json({ message: "新規登録が完了しました。", customer: newCustomer });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await Customer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "削除成功!", user: user });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

const generateRandomPassword = () => {
  return crypto
    .randomBytes(12)
    .toString("base64")
    .slice(0, 12)
    .replace(/[^a-zA-Z0-9]/g, ""); // Alphanumeric characters only
};
