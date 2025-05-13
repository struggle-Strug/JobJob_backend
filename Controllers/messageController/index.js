const CustomerModel = require("../../Models/CustomerModel");
const FacilityModel = require("../../Models/FacilityModel");
const JobPostModel = require("../../Models/JobPostModel");
const MessageModel = require("../../Models/MessageModel");
const UserModel = require("../../Models/UserModel");
const sgMail = require("@sendgrid/mail");

exports.save = async (req, res) => {
  try {
    const { jobPost_id, sender, recevier, content, meetingDate } = req.body;
    const customer = await CustomerModel.findOne({ _id: recevier });
    const jobPost = await JobPostModel.findOne({ jobpost_id: jobPost_id });
    const facility = await FacilityModel.findOne({
      facility_id: jobPost.facility_id,
    });

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
      text: `差出人：ジョブジョブ運営事務局
FROM：noreply@jobjob-jp.com
件名：［ジョブジョブ］応募完了のお知らせ

この度はジョブジョブでの応募ありがとうございます。

■応募求人
${facility.name}
${jobPost.type}(${jobPost.employment_type})
■面接希望日
${meetingDate
  .map(
    (meeting) =>
      `${meeting.date} ${meeting.times
        .map((meetingTime) => `${meetingTime.time}:${meetingTime.minute}~`)
        .join(", ")}`
  )
  .join("\n")}

応募後の法人・施設とのやり取りはメッセージ機能をご利用ください。
http://staging.jobjob-jp.com/members/message
応募済み求人の確認はこちら
http://staging.jobjob-jp.com/members/job_offers/apply


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
        <p>件名：［ジョブジョブ］応募完了のお知らせ</p>
        <p>この度はジョブジョブでの応募ありがとうございます。</p>
        <p>■応募求人</p>
        <p>${facility.name}</p>
        <p>${jobPost.type}(${jobPost.employment_type})</p>
        <p>■面接希望日</p>
        <p>${meetingDate
          .map(
            (meeting) =>
              `${meeting.date} ${meeting.times
                .map(
                  (meetingTime) => `${meetingTime.time}:${meetingTime.minute}~`
                )
                .join(", ")}`
          )
          .join("\n")}</p>
        <p>応募後の法人・施設とのやり取りはメッセージ機能をご利用ください。</p>
        <p><a href="http://staging.jobjob-jp.com/members/message" target="_blank">http://staging.jobjob-jp.com/members/message</a></p>
        <p>応募済み求人の確認はこちら</p>
        <p><a href="http://staging.jobjob-jp.com/members/job_offers/apply" target="_blank">http://staging.jobjob-jp.com/members/job_offers/apply</a></p>
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
          facility_id: jobPost?.facility_id,
        });
        const customer = await CustomerModel.findOne({
          customer_id: jobPost?.customer_id,
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

    // ✅ Fetch message by ID
    const message = await MessageModel.findOne({ message_id: id }).lean();
    if (!message) {
      return res.json({ message: "メッセージが見つかりません。", error: true });
    }

    // ✅ Fetch jobPost if message exists
    const jobPost = await JobPostModel.findOne({
      jobpost_id: message.jobPost_id,
    }).lean();
    if (!jobPost) {
      return res.json({ message: "求人情報が見つかりません。", error: true });
    }

    // ✅ Fetch facility and customer if jobPost exists
    const facility =
      (await FacilityModel.findOne({
        facility_id: jobPost.facility_id,
      }).lean()) || null;
    const customer =
      (await CustomerModel.findOne({
        customer_id: jobPost.customer_id,
      }).lean()) || null;

    return res.json({
      message: {
        ...message,
        customer_id: customer,
        facility_id: facility,
        jobpost_id: jobPost,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching message by ID:", error);
    return res.status(500).json({ message: "サーバーエラー", error: true });
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
    const companyName = req.user.data.companyName;
    const customers = await CustomerModel.find({ companyName: companyName });
    const customerIds = customers.map((cl) => cl._id);
    const messages = await MessageModel.find({ second: { $in: customerIds } });

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
    const messages = await MessageModel.find();
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

    // ✅ Fetch messages for user
    const messages = await MessageModel.find({
      $or: [{ first: id }, { second: id }],
    });

    // ✅ Fix status filtering
    let filteredMessages;
    if (status === "allOnGoings") {
      filteredMessages = messages;
    } else if (status === "allEnds") {
      const endStatuses = ["入職済", "不採用", "内定辞退", "選考終了"];
      filteredMessages = messages.filter((message) =>
        endStatuses.includes(message.status)
      );
    } else {
      filteredMessages = messages.filter(
        (message) => message.status === status
      );
    }

    // ✅ Fetch jobPost, facility, and user in parallel to improve performance
    const processes = await Promise.all(
      filteredMessages.map(async (message) => {
        const jobPost = await JobPostModel.findOne({
          jobpost_id: message.jobPost_id,
        }).lean();
        if (!jobPost) return null; // Skip if job post is missing

        const facility = await FacilityModel.findOne({
          facility_id: jobPost.facility_id,
        }).lean();
        const user_id = message.first === id ? message.second : message.first;
        const user = await UserModel.findOne({ _id: user_id }).lean();

        return {
          ...message.toObject(), // Convert MongoDB document to plain object
          facility_id: facility || null, // Include facility data (or null if not found)
          jobpost_id: jobPost || null, // Include job post data (or null if not found)
          user_id: user || null, // Include user data (or null if not found)
        };
      })
    );

    // ✅ Remove null values (when jobPost is missing)
    res.json({ processes: processes.filter((p) => p !== null) });
  } catch (error) {
    console.error("❌ Error in getByStatus:", error);
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getAllByStatus = async (req, res) => {
  try {
    const status = req.params.status;

    // ✅ Fetch all messages
    const messages = await MessageModel.find({}).lean();

    // ✅ Fix status filtering
    let filteredMessages;
    if (status === "allOnGoings") {
      filteredMessages = messages;
    } else if (status === "allEnds") {
      const endStatuses = ["入職済", "不採用", "内定辞退", "選考終了"];
      filteredMessages = messages.filter((message) =>
        endStatuses.includes(message.status)
      );
    } else {
      filteredMessages = messages.filter(
        (message) => message.status === status
      );
    }

    // ✅ Fetch jobPost, facility, and user in parallel to improve performance
    const processes = await Promise.all(
      filteredMessages.map(async (message) => {
        // ✅ Fetch jobPost
        const jobPost = await JobPostModel.findOne({
          jobpost_id: message.jobPost_id,
        }).lean();
        if (!jobPost) return null; // ❌ Skip if jobPost is missing

        // ✅ Fetch facility
        const facility =
          (await FacilityModel.findOne({
            facility_id: jobPost.facility_id,
          }).lean()) || null;

        // ✅ Ensure content exists before accessing sender
        const user_id =
          message.content?.length > 0 ? message.content[0].sender : null;
        const user = user_id
          ? await UserModel.findOne({ _id: user_id }).lean()
          : null;

        return {
          ...message, // ✅ Already a plain object from `.lean()`
          facility_id: facility,
          jobpost_id: jobPost,
          user_id: user,
        };
      })
    );

    // ✅ Remove null values to prevent errors
    res.json({ processes: processes.filter(Boolean) });
  } catch (error) {
    console.error("❌ Error fetching messages by status:", error);
    return res.status(500).json({ message: "サーバーエラー", error: true });
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

exports.getByCompany = async (req, res) => {
  try {
    const companyName = req.user.data.companyName;

    // ✅ Fetch all customers belonging to the company
    const customers = await CustomerModel.find({ companyName: companyName });

    // ✅ Extract customer IDs
    const customerIds = customers.map((cl) => cl._id);

    // ✅ Ensure customerIds is not empty before querying messages
    if (customerIds.length === 0) {
      return res.json({ message: "この会社には顧客が見つかりません。" });
    }

    // ✅ Retrieve messages where 'second' is in customerIds
    const messages = await MessageModel.find({
      second: { $in: customerIds },
    }).sort({ created_at: -1 });

    // ✅ If no messages found, return a proper response
    if (messages.length === 0) {
      return res.json({ message: "メッセージが見つかりません。" });
    }

    // ✅ Fetch jobPost, facility, customer, and user in parallel to improve performance
    const messagesWithDetails = await Promise.all(
      messages.map(async (message) => {
        const jobPost = await JobPostModel.findOne({
          jobpost_id: message.jobPost_id,
        }).lean();
        if (!jobPost) return null; // ❌ Skip if jobPost is missing

        const facility = await FacilityModel.findOne({
          facility_id: jobPost.facility_id,
        }).lean();
        const customer = await CustomerModel.findOne({
          customer_id: jobPost.customer_id,
        }).lean();
        const user = await UserModel.findOne({ _id: message.first }).lean();

        return {
          ...message.toObject(), // Convert MongoDB document to plain object
          facility_id: facility || null, // ✅ Include facility data (or null if not found)
          jobpost_id: jobPost || null, // ✅ Include job post data (or null if not found)
          customer_id: customer || null, // ✅ Include customer data (or null if not found)
          user_id: user || null, // ✅ Include user data (or null if not found)
        };
      })
    );

    // ✅ Remove null values to prevent errors
    return res.json({
      message: "取得成功",
      messages: messagesWithDetails.filter(Boolean),
    });
  } catch (error) {
    console.error("❌ Error fetching messages by company:", error);
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getCertainMessageByCompany = async (req, res) => {
  try {
    const id = req.params.id;

    // ✅ Fetch the specific message by ID
    const certainMessage = await MessageModel.findById(id).lean();
    if (!certainMessage) {
      return res.json({ message: "メッセージが見つかりません。", error: true });
    }

    // ✅ Update the unread field manually in the database
    const updateResult = await MessageModel.updateOne(
      { _id: id },
      { $set: { unread: false } }
    );

    if (updateResult.nModified === 0) {
      return res.status(400).json({ message: "Failed to mark as read." });
    }

    // ✅ Fetch jobPost related to the message
    const jobPost = await JobPostModel.findOne({
      jobpost_id: certainMessage.jobPost_id,
    }).lean();
    if (!jobPost) {
      return res.json({ message: "求人情報が見つかりません。", error: true });
    }

    // ✅ Fetch facility, customer, and user related to the jobPost
    const facility =
      (await FacilityModel.findOne({
        facility_id: jobPost.facility_id,
      }).lean()) || null;
    const customer =
      (await CustomerModel.findOne({
        customer_id: jobPost.customer_id,
      }).lean()) || null;
    const user =
      (await UserModel.findOne({ _id: certainMessage.first }).lean()) || null;

    // After everything is complete, return the response
    return res.json({
      message: "取得成功",
      messageDetails: {
        ...certainMessage,
        facility_id: facility,
        jobpost_id: jobPost,
        customer_id: customer,
        user_id: user,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching certain message by company:", error);
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};
