const FacilityModel = require("../../Models/FacilityModel");
const CustomerModel = require("../../Models/CustomerModel");
const JobPostModel = require("../../Models/JobPostModel");
const sgMail = require("@sendgrid/mail");

exports.createFacility = async (req, res) => {
  try {
    const allFacilities = await FacilityModel.find();
    const lastFacility = allFacilities[allFacilities.length - 1];
    const newFacilityId = lastFacility
      ? Number(lastFacility.facility_id) + 1
      : 1;
    const newFacility = new FacilityModel({
      customer_id: req.body.customer_id,
      facility_id: newFacilityId,
      name: req.body.name,
      postal_code: req.body.postal_code,
      prefecture: req.body.prefecture,
      city: req.body.city,
      village: req.body.village,
      building: req.body.building,
      photo: req.body.photo,
      introduction: req.body.introduction,
      job_type: req.body.job_type,
      access: req.body.access,
      access_station: req.body.access_station,
      access_text: req.body.access_text,
      facility_genre: req.body.facility_genre,
      service_type: req.body.service_type,
      establishment_date: req.body.establishment_date,
      service_time: req.body.service_time,
      rest_day: req.body.rest_day,
      allowed: "pending",
    });

    await newFacility.save();
    res.status(200).json({ message: "施設登録完了", facility: newFacility });
  } catch (error) {
    console.error("Facility作成エラー:", error);
    res.status(500).json({ message: "サーバーエラー", error: error.message });
  }
};

exports.getFacilities = async (req, res) => {
  try {
    const { jobType, facility, pref, employmentType } = req.query;
    let filter = {};

    // Apply filters for all users (including customers)
    if (jobType) filter.job_type = { $in: [jobType] };
    if (facility) filter.facility_genre = facility;
    if (pref) filter.prefecture = pref;
    filter.allowed = "allowed"; // Fix assignment

    // Fetch facilities based on filters
    const facilities = await FacilityModel.find(filter);

    // Fetch job posts for each facility
    const facilitiesWithDetails = await Promise.all(
      facilities.map(async (facility) => {
        const jobPosts = await JobPostModel.find({
          facility_id: facility.facility_id,
          allowed: "allowed", // Only fetch allowed job posts
        });

        return {
          ...facility.toObject(),
          jobPosts, // Attach job posts to facility
        };
      })
    );

    // Filter facilities based on employmentType (if provided)
    const filteredFacilities = employmentType
      ? facilitiesWithDetails.filter((facility) =>
          facility.jobPosts.some((jobpost) =>
            jobpost.employment_type.includes(employmentType)
          )
        )
      : facilitiesWithDetails;

    return res
      .status(200)
      .json({ message: "施設取得成功", facility: filteredFacilities });
  } catch (error) {
    console.error("❌ Error fetching facilities:", error);
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getCustomerFacilties = async (req, res) => {
  try {
    let filter = {};

    if (req.user.data.role === "customer") {
      const customer = await CustomerModel.findOne({
        customer_id: req.user.data.customer_id,
      });

      if (!customer) {
        return res
          .status(404)
          .json({ message: "顧客が見つかりません", error: true });
      }

      const customers = await CustomerModel.find({
        companyName: customer.companyName,
      });

      const customerIds = customers.map((cust) => cust.customer_id);
      filter.customer_id = { $in: customerIds }; // Always include this condition

      if (Object.keys(req.query).length === 0) {
        const facilities = await FacilityModel.find(filter);
        return res
          .status(200)
          .json({ message: "施設取得成功", facility: facilities });
      }
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getAllFacilities = async (req, res) => {
  try {
    const facilities = await FacilityModel.find().sort({ createdAt: -1 });

    const facilitiesWithDetails = await Promise.all(
      facilities.map(async (facility) => {
        const customer = await CustomerModel.findOne({
          customer_id: facility.customer_id,
        });
        return {
          ...facility.toObject(),
          customer_id: customer, // Attach job posts to facility
        };
      })
    );
    res
      .status(200)
      .json({ message: "施設取得成功", facility: facilitiesWithDetails });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getFacility = async (req, res) => {
  try {
    const facility = await FacilityModel.findOne({
      facility_id: req.params.id,
    });

    console.log(req.user);

    // if (
    //   (req.user === null || req, user.role === "member") &&
    //   facility.allowed !== "allowed"
    // ) {
    //   return res.json({
    //     message: "この施設は承認されていない施設です。",
    //     error: true,
    //   });
    // }

    const jobPosts = (
      await JobPostModel.find({ facility_id: facility.facility_id })
    ).filter((jobPost) => jobPost.allowed === "allowed");

    const facilityWithDetails = {
      ...facility.toObject(),
      jobPosts: jobPosts,
    };
    res
      .status(200)
      .json({ message: "施設取得成功", facility: facilityWithDetails });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getFacilityByUser = async (req, res) => {
  try {
    const facility = await FacilityModel.findOne({
      facility_id: req.params.id,
    });

    if (facility.allowed !== "allowed") {
      return res.json({
        message: "この施設は承認されていない施設です。",
      });
    }

    const jobPosts = (
      await JobPostModel.find({ facility_id: facility.facility_id })
    ).filter((jobPost) => jobPost.allowed === "allowed");

    const facilityWithDetails = {
      ...facility.toObject(),
      jobPosts: jobPosts,
    };
    res
      .status(200)
      .json({ message: "施設取得成功", facility: facilityWithDetails });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getPendingFacilities = async (req, res) => {
  try {
    const facilities = await FacilityModel.find({ allowed: "pending" }).sort({
      createdAt: -1,
    });

    const facilitiesWithDetails = await Promise.all(
      facilities.map(async (facility) => {
        const customer = await CustomerModel.findOne({
          customer_id: facility.customer_id,
        });
        const jobposts = await JobPostModel.find({
          facility_id: facility.facility_id,
        });
        return {
          ...facility.toObject(),
          customer_id: customer, // Attach job posts to facility
          jobPosts: jobposts,
        };
      })
    );
    res
      .status(200)
      .json({ message: "施設取得成功", facility: facilitiesWithDetails });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.updateFacilityStatus = async (req, res) => {
  try {
    const facility = await FacilityModel.findOne({
      facility_id: req.params.id,
    });
    facility.allowed = req.params.status;
    await facility.save();

    const customer = await CustomerModel.findOne({
      customer_id: facility.customer_id,
    });

    // Set your SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    if (req.params.status === "allowed") {
      const msg = {
        to: customer.email,
        from: "huskar020911@gmail.com", // Must be a verified sender on SendGrid
        subject: "施設審査結果",
        text: `差出人：ジョブジョブ運営事務局
FROM：noreply@jobjob-jp.com
件名：［ジョブジョブ］施設申請の審査結果

この度はジョブジョブへの施設情報を登録いただき誠にありがとうございます。

対象施設：${facility.name}。

ジョブジョブ運営事務局にて内容確認のうえ掲載を開始致しました。
掲載ページはこちらからご確認ください。
施設ページのURLが入ります。

こちらの施設での求人掲載は、下記よりログインのうえ求人登録をお願いします。
http://142.132.202.228:3000/customers/sign_in

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
        <p>件名：［ジョブジョブ］施設申請の審査結果</p>
        <p>この度はジョブジョブへの施設情報を登録いただき誠にありがとうございます。</p>
        <p>対象施設：<strong>${facility.name}</strong>。</p>
        <p>ジョブジョブ運営事務局にて内容確認のうえ掲載を開始致しました。</p>
        <p>掲載ページはこちらからご確認ください。</p>
        <p>施設ページのURLが入ります。</p>
        <p>こちらの施設での求人掲載は、下記よりログインのうえ求人登録をお願いします。</p>
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
        <p><a href="http://142.132.202.228:3000/customers/contact/" target="_blank">http://142.132.202.228:3000/customers/contact/</a></p>`,
      };

      await sgMail.send(msg);
    } else if (req.params.status === "draft") {
      const msg = {
        to: customer.email,
        from: "huskar020911@gmail.com", // Must be a verified sender on SendGrid
        subject: "施設審査結果",
        text: `差出人：ジョブジョブ運営事務局
FROM：noreply@jobjob-jp.com
件名：［ジョブジョブ］施設申請の審査結果

この度はジョブジョブへの施設情報を登録いただき誠にありがとうございます。

対象施設：${facility.name}。

ジョブジョブ運営事務局にて内容確認させていただいたところ、不適切な表現や情報が含まれておりますため差し戻しとさせていただきます。
お手数ですが、下記よりログインのうえ施設情報を修正いただき再度申請をお願いします。
http://142.132.202.228:3000/customers/sign_in


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
        <p>件名：［ジョブジョブ］施設申請の審査結果</p>
        <p>この度はジョブジョブへの施設情報を登録いただき誠にありがとうございます。</p>
        <p>対象施設：<strong>${facility.name}</strong>。</p>
        <p>ジョブジョブ運営事務局にて内容確認させていただいたところ、不適切な表現や情報が含まれておりますため差し戻しとさせていただきます。</p>
        <p>お手数ですが、下記よりログインのうえ施設情報を修正いただき再度申請をお願いします。</p>
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
        <p><a href="http://142.132.202.228:3000/customers/contact/" target="_blank">http://142.132.202.228:3000/customers/contact/</a></p>`,
      };

      await sgMail.send(msg);
    } else if (req.params.status === "ended") {
      // Set all job posts with this facility to "draft"
      const result = await JobPostModel.updateMany(
        { facility_id: facility.facility_id },
        { allowed: "draft" }
      );
    }

    res
      .status(200)
      .json({ message: "施設アップデート成功", facility: facility });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.updateFacility = async (req, res) => {
  try {
    // Find the facility by its ID and update it with the request body
    const facility = await FacilityModel.findOneAndUpdate(
      { facility_id: req.params.id }, // Filter by the `facility_id`
      req.body, // Update with request body data
      { new: true } // Ensure the updated document is returned
    );

    // If the facility is not found, return a 404 error
    if (!facility) {
      return res.status(404).json({ message: "施設が見つかりませんでした。" }); // "Facility not found"
    }

    // Update the status of the facility and save it to the database
    facility.allowed = "pending";
    await facility.save(); // Save the updated facility document to the database

    res
      .status(200)
      .json({ message: "施設を更新しました。", facility: facility }); // "Facility updated"
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラー", error: true }); // "Server error"
  }
};

exports.getByCompany = async (req, res) => {
  try {
    // Step 1: Find all customers that belong to the same company as the logged-in user
    const allCustomers = await CustomerModel.find({
      companyName: req.user.data.companyName,
    });

    // Step 2: Extract all customer IDs
    const customerIds = allCustomers.map((customer) => customer.customer_id);

    // Step 3: Find facilities where `customer_id` is in the extracted customer IDs
    const facilities = await FacilityModel.find({
      customer_id: { $in: customerIds },
    });

    // Step 4: Return the response
    res.status(200).json({ message: "施設取得完了", facilities: facilities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.deleteFacility = async (req, res) => {
  try {
    const facility = await FacilityModel.findOneAndDelete({
      facility_id: req.params.id,
    });

    await JobPostModel.deleteMany({ facility_id: req.params.id });

    res.status(200).json({ message: "施設削除完了", facility: facility });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};
