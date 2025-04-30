const JobPostModel = require("../../Models/JobPostModel");
const customerModel = require("../../Models/CustomerModel");
const facilityModel = require("../../Models/FacilityModel");
const sgMail = require("@sendgrid/mail");
const MessageModel = require("../../Models/MessageModel");
const JobType = require("../../utils/constants/jobtype");

exports.createJobPost = async (req, res) => {
  try {
    const jobPosts = await JobPostModel.find({});
    const lastJobPost = jobPosts[jobPosts.length - 1];

    // ✅ Determine the new jobpost_id
    const newJobPostId = lastJobPost ? Number(lastJobPost.jobpost_id) + 1 : 1;

    // ✅ Create new job post
    const newJobPost = new JobPostModel({
      facility_id: req.body.facility_id,
      customer_id: req.body.customer_id,
      jobpost_id: newJobPostId, // ✅ Correctly assigned unique ID
      type: req.body.type,
      picture: req.body.picture,
      sub_title: req.body.sub_title,
      sub_description: req.body.sub_description,
      work_item: req.body.work_item,
      work_content: req.body.work_content,
      service_subject: req.body.service_subject,
      service_type: req.body.service_type,
      employment_type: req.body.employment_type,
      salary_type: req.body.salary_type,
      salary_min: req.body.salary_min,
      salary_max: req.body.salary_max,
      salary_remarks: req.body.salary_remarks,
      expected_income: req.body.expected_income,
      treatment_type: req.body.treatment_type,
      treatment_content: req.body.treatment_content,
      work_time_type: req.body.work_time_type,
      work_time_content: req.body.work_time_content,
      rest_type: req.body.rest_type,
      rest_content: req.body.rest_content,
      special_content: req.body.special_content,
      education_content: req.body.education_content,
      qualification_type: req.body.qualification_type,
      qualification_other: req.body.qualification_other,
      qualification_content: req.body.qualification_content,
      qualification_welcome: req.body.qualification_welcome,
      allowed: req.body.allowed,
      process: req.body.process,
      registered_at: "",
    });

    await newJobPost.save();
    res
      .status(200)
      .json({ message: "求人を登録しました。", jobpost: newJobPost });
  } catch (error) {
    console.error("❌ Error creating job post:", error);
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.createJobPostByCopy = async (req, res) => {
  try {
    const jobPost_id = req.params.id;
    const { facility_id } = req.body;
    const jobPost = await JobPostModel.findOne({ jobpost_id: jobPost_id });
    const jobPosts = await JobPostModel.find({});
    const lastJobPost = jobPosts[jobPosts.length - 1];

    // ✅ Determine the new jobpost_id
    const newJobPostId = lastJobPost ? Number(lastJobPost.jobpost_id) + 1 : 1;
    // Create a new job post instance
    const newJobPost = new JobPostModel({
      facility_id: facility_id,
      customer_id: req.user.data.customer_id,
      jobpost_id: newJobPostId,
      type: jobPost.type,
      picture: jobPost.picture,
      sub_title: jobPost.sub_title,
      sub_description: jobPost.sub_description,
      work_item: jobPost.work_item,
      work_content: jobPost.work_content,
      service_subject: jobPost.service_subject,
      service_type: jobPost.service_type,
      employment_type: jobPost.employment_type,
      salary_type: jobPost.salary_type,
      salary_min: jobPost.salary_min,
      salary_max: jobPost.salary_max,
      salary_remarks: jobPost.salary_remarks,
      expected_income: jobPost.expected_income,
      treatment_type: jobPost.treatment_type,
      treatment_content: jobPost.treatment_content,
      work_time_type: jobPost.work_time_type,
      work_time_content: jobPost.work_time_content,
      rest_type: jobPost.rest_type,
      rest_content: jobPost.rest_content,
      special_content: jobPost.special_content,
      education_content: jobPost.education_content,
      qualification_type: jobPost.qualification_type,
      qualification_other: jobPost.qualification_other,
      qualification_content: jobPost.qualification_content,
      qualification_welcome: jobPost.qualification_welcome,
      process: jobPost.process,
      registered_at: "",
    });

    await newJobPost.save();
    res
      .status(200)
      .json({ message: "求人を登録しました。", jobpost: newJobPost });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.updateJobPost = async (req, res) => {
  try {
    const jobPost = await JobPostModel.findOneAndUpdate(
      { jobpost_id: req.params.id },
      req.body
    );
    res.status(200).json({ message: "求人を更新しました。", jobpost: jobPost });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getJobPostById = async (req, res) => {
  try {
    const jobPost = await JobPostModel.findOne({ jobpost_id: req.params.id });
    if (!jobPost) {
      return res
        .status(404)
        .json({ message: "Job post not found", error: true });
    }

    // Fetch customer and facility details
    const customer = await customerModel.findOne({
      customer_id: jobPost.customer_id,
    });
    const facility = await facilityModel.findOne({
      facility_id: jobPost.facility_id,
    });

    const jobPostWithDetails = {
      ...jobPost.toObject(), // Convert MongoDB document to a plain object
      customer_id: customer, // Include customer data
      facility_id: facility, // Include facility data
    };

    res.status(200).json({ jobpost: jobPostWithDetails });
  } catch (error) {
    console.error("Error fetching job post by ID:", error);
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getJobPostByUserById = async (req, res) => {
  try {
    const jobPost = await JobPostModel.findOne({ jobpost_id: req.params.id });
    if (!jobPost) {
      return res
        .status(404)
        .json({ message: "Job post not found", error: true });
    }

    if (jobPost.allowed !== "allowed") {
      return res.json({
        message: "この求人は承認されていない求人です。",
      });
    }

    // Fetch customer and facility details
    const customer = await customerModel.findOne({
      customer_id: jobPost.customer_id,
    });
    const facility = await facilityModel.findOne({
      facility_id: jobPost.facility_id,
    });

    const jobPostWithDetails = {
      ...jobPost.toObject(), // Convert MongoDB document to a plain object
      customer_id: customer, // Include customer data
      facility_id: facility, // Include facility data
    };

    res.status(200).json({ jobpost: jobPostWithDetails });
  } catch (error) {
    console.error("Error fetching job post by ID:", error);
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getJobPostByFacilityId = async (req, res) => {
  try {
    const jobPosts = await JobPostModel.find({
      facility_id: req.params.id,
    }).sort({ created_at: -1 });

    if (!jobPosts) {
      return res
        .status(404)
        .json({ message: "Job post not found", error: true });
    }

    // Resolve customer and facility data
    const jobPostsWithDetails = await Promise.all(
      jobPosts.map(async (jobpost) => {
        const customer = await customerModel.findOne({
          customer_id: jobpost.customer_id,
        });
        const facility = await facilityModel.findOne({
          facility_id: jobpost.facility_id,
        });
        return {
          ...jobpost.toObject(), // Convert MongoDB document to plain object
          customer_id: customer, // Include customer data
          facility_id: facility, // Include facility data
        };
      })
    );

    res.status(200).json({ jobposts: jobPostsWithDetails });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getJobPosts = async (req, res) => {
  try {
    const jobPosts = await JobPostModel.find({}).sort({ created_at: -1 });
    // Resolve customer and facility data
    const jobPostsWithDetails = await Promise.all(
      jobPosts.map(async (jobpost) => {
        const customer = await customerModel.findOne({
          customer_id: jobpost.customer_id,
        });
        const facility = await facilityModel.findOne({
          facility_id: jobpost.facility_id,
        });
        return {
          ...jobpost.toObject(), // Convert MongoDB document to plain object
          customer_id: customer, // Include customer data
          facility_id: facility, // Include facility data
        };
      })
    );

    res.status(200).json({ jobposts: jobPostsWithDetails });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.updateJobPostStatus = async (req, res) => {
  try {
    const jobPost = await JobPostModel.findOne({ jobpost_id: req.params.id });
    jobPost.allowed = req.params.status;
    await jobPost.save();

    const customer = await customerModel.findOne({
      customer_id: jobPost.customer_id,
    });

    const facility = await facilityModel.findOne({
      facility_id: jobPost.facility_id,
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
職種：${jobPost.type}。
タイトル：${jobPost.sub_title}。

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
        <p>職種：<strong>${jobPost.type}</strong>。</p>
        <p>タイトル：<strong>${jobPost.sub_title}</strong>。</p>
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
      職種：${jobPost.type}。
      タイトル：${jobPost.sub_title}。
      
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
              <p>職種：<strong>${jobPost.type}</strong>。</p>
              <p>タイトル：<strong>${jobPost.sub_title}</strong>。</p>
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
    }
    res.status(200).json({ message: "求人掲載申請完了", jobPost: jobPost });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getFavourites = async (req, res) => {
  try {
    const jobPosts = await JobPostModel.find({
      jobpost_id: { $in: req.body.data },
    });
    // Resolve customer and facility data
    const jobPostsWithDetails = await Promise.all(
      jobPosts.map(async (jobpost) => {
        const customer = await customerModel.findOne({
          customer_id: jobpost.customer_id,
        });
        const facility = await facilityModel.findOne({
          facility_id: jobpost.facility_id,
        });
        return {
          ...jobpost.toObject(), // Convert MongoDB document to plain object
          customer_id: customer, // Include customer data
          facility_id: facility, // Include facility data
        };
      })
    );
    res
      .status(200)
      .json({ message: "求人取得成功", jobPosts: jobPostsWithDetails });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getFilteredJobPosts = async (req, res) => {
  try {
    const filters = req.body;
    const jobPosts = await JobPostModel.find({}).sort({ created_at: -1 });
    const jobPostsWithDetails = await Promise.all(
      jobPosts.map(async (jobpost) => {
        const facility = await facilityModel.findOne({
          facility_id: jobpost.facility_id,
        });
        return {
          ...jobpost.toObject(), // Convert MongoDB document to plain object
          facility_id: facility, // Include facility data
        };
      })
    );
    const filteredJobPosts = jobPostsWithDetails
      .filter((jobpost) => jobpost.facility_id.allowed === "allowed")
      .filter((jobpost) => jobpost.allowed === "allowed")
      .filter((jobpost) => jobpost.type === filters.JobType) // Filter by job type
      .filter((jobpost) =>
        filters.facility ? jobpost.facility_id.name === filters.facility : true
      ) // Filter by facility
      .filter((jobpost) =>
        filters.pref ? jobpost.facility_id.prefecture === filters.pref : true
      ) // Filter by prefecture
      .filter(
        (jobpost) =>
          filters.muni !== "" ? jobpost.facility_id.city === filters.muni : true // Filter by municipality
      )
      .filter(
        (jobpost) =>
          filters.employmentType.length > 0
            ? filters.employmentType.includes(jobpost.employment_type[0])
            : true // Include all if employment_type is null
      )
      .filter((jobpost) => {
        if (filters.feature.length > 0) {
          // Check if feature_1 is not null
          const jobPostFeatures = [
            ...jobpost.work_item,
            ...jobpost.service_subject,
            ...jobpost.service_type,
            ...jobpost.treatment_type,
            ...jobpost.rest_type,
            ...jobpost.work_time_type,
            ...jobpost.education_content,
          ];
          return filters.feature.some((f) => jobPostFeatures.includes(f)); // Filter if feature_1 matches
        }
        return true; // Include all if feature_1 is null
      })
      .filter((jobpost) => {
        if (filters.monthlySalary) {
          if (jobpost.salary_type === "月給") {
            // Check if monthlySalary is not null
            const salaryMin = jobpost.salary_min;
            const monthlySalary = parseInt(filters.monthlySalary);
            return salaryMin >= monthlySalary; // Filter if monthlySalary matches
          }
          return true;
        }
        return true; // Include all if monthlySalary is null
      })
      .filter((jobpost) => {
        if (filters.hourlySalary) {
          if (jobpost.salary_type === "時給") {
            // Check if hourlySalary is not null
            const salaryMin = jobpost.salary_min;
            const hourlySalary = parseInt(filters.hourlySalary);
            return salaryMin >= hourlySalary; // Filter if hourlySalary matches
          }
          return true;
        }
        return true; // Include all if hourlySalary is null
      });

    // Send only the job posts from index 1 to index 30
    const paginatedJobPosts = filteredJobPosts.slice(
      30 * (filters.page - 1),
      30 * filters.page - 1
    );

    return res.json({
      message: "Sucessfully fetch jobPosts",
      jobposts: paginatedJobPosts,
      allJobPostsNumbers: filteredJobPosts.length,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getAppliedJobPosts = async (req, res) => {
  try {
    // Get all messages where the user is either first or second
    const myMessages = await MessageModel.find({
      $or: [{ first: req.user.data._id }, { second: req.user.data._id }],
      status: "応募済", // Filter directly in the DB instead of `.filter()`
    });
    // Extract jobPost IDs to fetch all at once
    const jobPostIds = myMessages.map((msg) => msg.jobPost_id);

    // Fetch all job posts in one query
    const jobPosts = await JobPostModel.find({
      jobpost_id: { $in: jobPostIds },
    });

    // Map job posts with their corresponding message
    const jobPostsWithMessages = jobPosts.map((jobPost) => {
      const message = myMessages.find(
        (msg) => msg.jobPost_id.toString() === jobPost.jobpost_id.toString()
      );
      return { ...jobPost.toObject(), message }; // Convert jobPost to plain object
    });

    return res.json({
      message: "取得成功",
      jobPosts: jobPostsWithMessages,
    });
  } catch (error) {
    console.error("❌ Error fetching applied job posts:", error);
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getJobPostsNumbers = async (req, res) => {
  try {
    // ✅ Define all job types in a single array
    const allJobTypeKeys = [
      ...Object.keys(JobType["医科"] || {}),
      ...Object.keys(JobType["歯科"] || {}),
      ...Object.keys(JobType["介護"] || {}),
      ...Object.keys(JobType["保育"] || {}),
      ...Object.keys(JobType["その他"] || {}),
      ...Object.keys(JobType["リハビリ／代替医療"] || {}),
      ...Object.keys(JobType["ヘルスケア／美容"] || {}),
    ];

    // ✅ Use MongoDB aggregation to count job posts by type (only allowed job posts)
    const jobPostsCounts = await JobPostModel.aggregate([
      { $match: { type: { $in: allJobTypeKeys }, allowed: "allowed" } }, // ✅ Add `allowed: "allowed"` condition
      { $group: { _id: "$type", count: { $sum: 1 } } }, // ✅ Count occurrences per type
    ]);

    // ✅ Convert aggregation result into an object
    const JobPostsNumbers = allJobTypeKeys.reduce((acc, jobType) => {
      acc[jobType] =
        jobPostsCounts.find((entry) => entry._id === jobType)?.count || 0;
      return acc;
    }, {});

    return res.json({
      message: "取得成功",
      JobPostsNumbers: JobPostsNumbers,
    });
  } catch (error) {
    console.error("❌ Error fetching job post numbers:", error);
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getJobPostsByFacility = async (req, res) => {
  try {
    const { type } = req.body;
    const jobPosts = await JobPostModel.find({ type: type });
    const jobPostsWithDetails = await Promise.all(
      jobPosts.map(async (jobpost) => {
        const facility = await facilityModel.findOne({
          facility_id: jobpost.facility_id,
        });
        return {
          ...jobpost.toObject(), // Convert MongoDB document to plain object
          facility_id: facility, // Include facility data
        };
      })
    );
    const numbers = {
      病院: jobPostsWithDetails.filter(
        (j) => j.facility_id.facility_genre === "病院"
      ).length,
      診療所: jobPostsWithDetails.filter(
        (j) => j.facility_id.facility_genre === "診療所"
      ).length,
      "歯科診療所・技工所": jobPostsWithDetails.filter(
        (j) => j.facility_id.facility_genre === "歯科診療所・技工所"
      ).length,
      "代替医療・リラクゼーション": jobPostsWithDetails.filter(
        (j) => j.facility_id.facility_genre === "代替医療・リラクゼーション"
      ).length,
      "介護・福祉事業所": jobPostsWithDetails.filter(
        (j) => j.facility_id.facility_genre === "介護・福祉事業所"
      ).length,
      "薬局・ドラッグストア": jobPostsWithDetails.filter(
        (j) => j.facility_id.facility_genre === "薬局・ドラッグストア"
      ).length,
      訪問看護ステーション: jobPostsWithDetails.filter(
        (j) => j.facility_id.facility_genre === "訪問看護ステーション"
      ).length,
      "保育園・幼稚園": jobPostsWithDetails.filter(
        (j) => j.facility_id.facility_genre === "保育園・幼稚園"
      ).length,
      "美容・サロン・ジム": jobPostsWithDetails.filter(
        (j) => j.facility_id.facility_genre === "美容・サロン・ジム"
      ).length,
      "その他（企業・学校等）": jobPostsWithDetails.filter(
        (j) => j.facility_id.facility_genre === "その他（企業・学校等）"
      ).length,
    };
    return res.json({ message: "success", numbers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.deleteJobPost = async (req, res) => {
  try {
    const jobPost = await JobPostModel.findOneAndDelete({
      jobpost_id: req.params.id,
    });
    if (!jobPost)
      return res
        .status(404)
        .json({ message: "求人が見つかりません", error: true });
    res.status(200).json({ message: "求人削除完了" });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};
