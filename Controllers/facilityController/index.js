const FacilityModel = require("../../Models/FacilityModel");
const CustomerModel = require("../../Models/CustomerModel");
const JobPostModel = require("../../Models/JobPostModel");

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

    if (Object.keys(req.query).length === 0) {
      const facilities = await FacilityModel.find({});
      return res
        .status(200)
        .json({ message: "施設取得成功", facility: facilities });
    }

    let filter = {};
    if (jobType) filter.job_type = { $in: [jobType] }; // Match jobType in the array
    if (facility) filter.facility_genre = facility;
    if (pref) filter.prefecture = pref;
    filter.allowed === "allowed";

    // Fetch facilities based on the dynamic filter
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
          jobPosts, // Include filtered jobPosts data
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

    res
      .status(200)
      .json({ message: "施設取得成功", facility: filteredFacilities });
  } catch (error) {
    console.error("Error fetching facilities:", error);
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getAllFacilities = async (req, res) => {
  try {
    const facilities = await FacilityModel.find()
      .populate("customer_id")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "施設取得成功", facility: facilities });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getFacility = async (req, res) => {
  try {
    const facility = await FacilityModel.findOne({
      facility_id: req.params.id,
    });
    res.status(200).json({ message: "施設取得成功", facility: facility });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.pendingFacility = async (req, res) => {
  try {
    const facility = await FacilityModel.findOne({
      facility_id: req.params.id,
    });
    facility.allowed = "pending";
    await facility.save();
    res.status(200).json({ message: "施設掲載申請成功", facility: facility });
  } catch (error) {
    res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.allowFacility = async (req, res) => {
  try {
    const facility = await FacilityModel.findOne({
      facility_id: req.params.id,
    });
    facility.allowed = "allowed";
    facility.registrationDate = new Date();
    await facility.save();
    res.status(200).json({ message: "施設承認成功", facility: facility });
  } catch (error) {
    console.log(error);
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
