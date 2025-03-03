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
      registrationDate: new Date(),
    });
    await newCustomer.save();
    const msg = {
      to: req.body.email,
      from: "huskar020911@gmail.com", // Must be a verified sender on SendGrid
      subject: "イニシャルパスワード",
      text: `イニシャルパスワードは: ${initalPassword}`,
      html: `<strong>イニシャルパスワードは: ${initalPassword}</strong>`,
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
    const customers = await Customer.find();
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
    });
    res.status(200).json({ message: "ユーザー一覧取得成功", users: users });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.addUser = async (req, res) => {
  try {
    const customers = await Customer.find();
    const customer_id = customers.length + 1;

    const newCustomer = new Customer({
      customer_id: customer_id,
      companyName: req.user.data.companyName,
      huriganaCompanyName: req.user.data.huriganaCompanyName,
      contactPerson: req.body.contactPerson,
      huriganaContactPerson: req.body.huriganaContactPerson,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
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
