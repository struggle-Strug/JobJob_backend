const JobPostModel = require("../../Models/JobPostModel");
const customerModel = require("../../Models/CustomerModel");
const facilityModel = require("../../Models/FacilityModel");
const sgMail = require("@sendgrid/mail");
const MessageModel = require("../../Models/MessageModel");

exports.createJobPost = async (req, res) => {
  try {
    // ✅ Find the latest job post based on jobpost_id
    const latestJobPost = await JobPostModel.findOne().sort({ jobpost_id: -1 });

    // ✅ Determine the new jobpost_id
    const newJobPostId = latestJobPost
      ? Number(latestJobPost.jobpost_id) + 1
      : 1;

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
    const jobPost = await JobPostModel.findOne({ jobpost_id: jobPost_id });
    // ✅ Find the latest job post based on jobpost_id
    const latestJobPost = await JobPostModel.findOne().sort({ jobpost_id: -1 });

    // ✅ Determine the new jobpost_id
    const newJobPostId = latestJobPost
      ? Number(latestJobPost.jobpost_id) + 1
      : 1;
    // Create a new job post instance
    const newJobPost = new JobPostModel({
      facility_id: jobPost.facility_id,
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

    // Set your SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    if (req.params.status === "allowed") {
      const msg = {
        to: customer.email,
        from: "huskar020911@gmail.com", // Must be a verified sender on SendGrid
        subject: "施設審査結果",
        text: `施設審査の結果、掲載をいたしました。`,
        html: `<strong>施設審査の結果、掲載をいたしました</strong>`,
      };

      await sgMail.send(msg);
    } else if (req.params.status === "draft") {
      const msg = {
        to: customer.email,
        from: "huskar020911@gmail.com", // Must be a verified sender on SendGrid
        subject: "施設審査結果",
        text: `施設審査の結果、ご期待に沿うことができませんした。
    修正の上、再度申請をお願いいたします。`,
        html: `<strong>施設審査の結果、ご期待に沿うことができませんした。<br />修正の上、再度申請をお願いいたします。</strong>`,
      };

      await sgMail.send(msg);
    }
    res.status(200).json({ message: "求人掲載申請成功", jobPost: jobPost });
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
      .filter((jobpost) => jobpost.allowed === "allowed")
      .filter((jobpost) => jobpost.type === filters.JobType) // Filter by job type
      .filter((jobpost) =>
        filters.facility ? jobpost.facility_id.name === filters.facility : true
      ) // Filter by facility
      .filter((jobpost) => jobpost.facility_id.prefecture === filters.pref) // Filter by prefecture
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
          return filters.feature.every((f) => jobPostFeatures.includes(f)); // Filter if feature_1 matches
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
