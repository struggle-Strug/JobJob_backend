const FacilityModel = require("../../Models/FacilityModel");
const CustomerModel = require("../../Models/CustomerModel");
const JobPostModel = require("../../Models/JobPostModel");
const sgMail = require("@sendgrid/mail");

exports.createFacility = async (req, res) => {
  try {
    const allFacilities = await FacilityModel.find();
    const newFacility = new FacilityModel({
      customer_id: req.body.customer_id,
      facility_id: allFacilities.length + 1,
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
    res.status(200).json({ message: "施設登録成功", facility: newFacility });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getFacilities = async (req, res) => {
  try {
    const { jobType, facility, pref, employmentType } = req.query;
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

    res
      .status(200)
      .json({ message: "施設アップデート成功", facility: facility });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.updateFacility = async (req, res) => {
  try {
    const facility = await FacilityModel.findOneAndUpdate(
      { facility_id: req.params.id },
      req.body
    );
    res
      .status(200)
      .json({ message: "施設を更新しました。", facility: facility });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラー", error: true });
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
    res.status(200).json({ message: "施設取得成功", facilities: facilities });
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
    res.status(200).json({ message: "施設削除成功", facility: facility });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};
