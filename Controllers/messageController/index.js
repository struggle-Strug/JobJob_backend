const CustomerModel = require("../../Models/CustomerModel");
const FacilityModel = require("../../Models/FacilityModel");
const JobPostModel = require("../../Models/JobPostModel");
const MessageModel = require("../../Models/MessageModel");
const UserModel = require("../../Models/UserModel");
const sgMail = require("@sendgrid/mail");

exports.save = async (req, res) => {
  try {
    const { jobPost_id, sender, recevier, content } = req.body;
    const customer = await Customer.findOne({ _id: recevier });

    // Set your SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const messages = await MessageModel.find({});
    const message = await MessageModel.find({
      jobPost_id: jobPost_id,
      sender: sender,
    });

    if (message.length > 0)
      return res.json({ message: "応募済みです。", error: true });
    const newMessage = new MessageModel({
      message_id: messages.length + 1,
      first: sender,
      second: recevier,
      jobPost_id: jobPost_id,
      content: [
        {
          sender: sender,
          recevier: recevier,
          message: content,
          date: Date.now(),
        },
      ],
    });
    await newMessage.save();

    const msg = {
      to: req.user.data.email,
      from: "huskar020911@gmail.com", // Must be a verified sender on SendGrid
      subject: "応募完了",
      text: `応募が完了しました。`,
      html: `<strong>応募が完了しました。</strong>`,
    };

    const msg_1 = {
      to: customer.email,
      from: "huskar020911@gmail.com", // Must be a verified sender on SendGrid
      subject: "応募完了",
      text: `応募が完了しました。`,
      html: `<strong>応募が完了しました。</strong>`,
    };

    await sgMail.send(msg);
    await sgMail.send(msg_1);
    res.status(200).json({ message: "応募が完了しました。" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getMine = async (req, res) => {
  try {
    const id = req.params.id;
    const messages = await MessageModel.find({
      $or: [{ first: id }, { second: id }],
    });

    const messageWithDetails = await Promise.all(
      messages.map(async (message) => {
        const jobPost = await JobPostModel.findOne({
          jobpost_id: message.jobPost_id,
        });
        const facility = await FacilityModel.findOne({
          facility_id: jobPost.facility_id,
        });
        const customer = await CustomerModel.findOne({
          customer_id: jobPost.customer_id,
        });
        return {
          ...message.toObject(), // Convert MongoDB document to plain object
          customer_id: customer, // Include customer data
          facility_id: facility, // Include facility data
        };
      })
    );

    res.json({ messages: messageWithDetails });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find({});

    const messageWithDetails = await Promise.all(
      messages.map(async (message) => {
        const jobPost = await JobPostModel.findOne({
          jobpost_id: message.jobPost_id,
        });
        const facility = await FacilityModel.findOne({
          facility_id: jobPost.facility_id,
        });
        return {
          ...message.toObject(), // Convert MongoDB document to plain object
          facility_id: facility, // Include facility data
        };
      })
    );

    res.json({ messages: messageWithDetails });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const message = await MessageModel.findOne({ message_id: id });

    const jobPost = await JobPostModel.findOne({
      jobpost_id: message.jobPost_id,
    });
    const facility = await FacilityModel.findOne({
      facility_id: jobPost.facility_id,
    });
    const customer = await CustomerModel.findOne({
      customer_id: jobPost.customer_id,
    });

    res.json({
      message: {
        ...message.toObject(),
        customer_id: customer,
        facility_id: facility,
        jobpost_id: jobPost,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.send = async (req, res) => {
  try {
    const { message_id, sender, message, recevier, files } = req.body;

    const messages = await MessageModel.findOne({ message_id: message_id });

    const newMessage = {
      sender: sender,
      recevier: recevier,
      files: files,
      message: message,
    };
    await messages.content.push(newMessage);
    await messages.save().then((message) => {
      res.json({ message: message });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getJobNumbersByStatus = async (req, res) => {
  try {
    const messages = await MessageModel.find({
      $or: [{ first: req.user.data._id }, { second: req.user.data._id }],
    });
    const jobNumbers = {
      allOnGoings: messages?.filter(
        (message) =>
          message.status === "応募済" ||
          message.status === "書類選考中" ||
          message.status === "面接日設定済" ||
          message.status === "面接実施中" ||
          message.status === "内定済" ||
          message.status === "内定承諾済"
      ).length,
      allEnds: messages?.filter(
        (message) =>
          message.status === "入職済" ||
          message.status === "不採用" ||
          message.status === "内定辞退" ||
          message.status === "選考終了"
      ).length,
      応募済: messages?.filter((message) => message.status === "応募済").length,
      書類選考中: messages?.filter((message) => message.status === "書類選考中")
        .length,
      面接日設定済: messages?.filter(
        (message) => message.status === "面接日設定済"
      ).length,
      面接実施中: messages?.filter((message) => message.status === "面接実施中")
        .length,
      内定済: messages?.filter((message) => message.status === "内定済").length,
      内定承諾済: messages?.filter((message) => message.status === "内定承諾済")
        .length,
      入職済: messages?.filter((message) => message.status === "入職済").length,
      不採用: messages?.filter((message) => message.status === "不採用").length,
      内定辞退: messages?.filter((message) => message.status === "内定辞退")
        .length,
      選考終了: messages?.filter((message) => message.status === "選考終了")
        .length,
    };
    return res.json({
      message: "Successfully get JobNumbers",
      jobNumbers: jobNumbers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getAllJobNumbersByStatus = async (req, res) => {
  try {
    const messages = await MessageModel.find({});
    const jobNumbers = {
      allOnGoings: messages?.filter(
        (message) =>
          message.status === "応募済" ||
          message.status === "書類選考中" ||
          message.status === "面接日設定済" ||
          message.status === "面接実施中" ||
          message.status === "内定済" ||
          message.status === "内定承諾済"
      ).length,
      allEnds: messages?.filter(
        (message) =>
          message.status === "入職済" ||
          message.status === "不採用" ||
          message.status === "内定辞退" ||
          message.status === "選考終了"
      ).length,
      応募済: messages?.filter((message) => message.status === "応募済").length,
      書類選考中: messages?.filter((message) => message.status === "書類選考中")
        .length,
      面接日設定済: messages?.filter(
        (message) => message.status === "面接日設定済"
      ).length,
      面接実施中: messages?.filter((message) => message.status === "面接実施中")
        .length,
      内定済: messages?.filter((message) => message.status === "内定済").length,
      内定承諾済: messages?.filter((message) => message.status === "内定承諾済")
        .length,
      入職済: messages?.filter((message) => message.status === "入職済").length,
      不採用: messages?.filter((message) => message.status === "不採用").length,
      内定辞退: messages?.filter((message) => message.status === "内定辞退")
        .length,
      選考終了: messages?.filter((message) => message.status === "選考終了")
        .length,
    };
    return res.json({
      message: "Successfully get JobNumbers",
      jobNumbers: jobNumbers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getByStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    const messages = await MessageModel.find({
      $or: [{ first: id }, { second: id }],
    });

    let filteredMessages;
    if (status === "allOnGoings") {
      filteredMessages = messages;
    } else if (status === "allEnds") {
      filteredMessages = messages?.filter(
        (message) =>
          message.status === ("入職済" || "不採用" || "内定辞退" || "選考終了")
      );
    } else {
      filteredMessages = messages?.filter(
        (message) => message.status === status
      );
    }

    const processes = await Promise.all(
      filteredMessages.map(async (message) => {
        const jobPost = await JobPostModel.findOne({
          jobpost_id: message.jobPost_id,
        });
        const facility = await FacilityModel.findOne({
          facility_id: jobPost.facility_id,
        });
        const user_id = message.first === id ? message.second : message.first;
        const user = await UserModel.findOne({ _id: user_id });
        return {
          ...message.toObject(), // Convert MongoDB document to plain object
          facility_id: facility, // Include facility data
          jobpost_id: jobPost,
          user_id: user, // Include user data
        };
      })
    );

    res.json({ processes: processes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getAllByStatus = async (req, res) => {
  try {
    const status = req.params.status;

    const messages = await MessageModel.find({});

    let filteredMessages;
    if (status === "allOnGoings") {
      filteredMessages = messages;
    } else if (status === "allEnds") {
      filteredMessages = messages?.filter(
        (message) =>
          message.status === ("入職済" || "不採用" || "内定辞退" || "選考終了")
      );
    } else {
      filteredMessages = messages?.filter(
        (message) => message.status === status
      );
    }

    const processes = await Promise.all(
      filteredMessages.map(async (message) => {
        const jobPost = await JobPostModel.findOne({
          jobpost_id: message.jobPost_id,
        });
        const facility = await FacilityModel.findOne({
          facility_id: jobPost.facility_id,
        });
        const user_id = message.content[0].sender;
        const user = await UserModel.findOne({ _id: user_id });
        return {
          ...message.toObject(), // Convert MongoDB document to plain object
          facility_id: facility, // Include facility data
          jobpost_id: jobPost,
          user_id: user, // Include user data
        };
      })
    );

    res.json({ processes: processes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const message = await MessageModel.findOneAndUpdate(
      { message_id: req.params.id },
      req.body
    );
    await message.save().then((message) => {
      res.json({ message: message });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};
