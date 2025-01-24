const JobPostModel = require("../../Models/JobPostModel")
const customerModel = require("../../Models/CustomerModel")
const facilityModel = require("../../Models/FacilityModel")

exports.createJobPost = async (req, res) => {
    try {
        const jobposts = await JobPostModel.find({});
        const newJobPost = new JobPostModel({
            name: req.body.name,
            facility_id: req.body.facility_id,
            customer_id: req.body.customer_id,
            jobpost_id: jobposts.length + 1,
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
    })

    await newJobPost.save();
    res.status(200).json({ message: "求人を登録しました。", jobpost: newJobPost });
    } catch (error) {
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.updateJobPost = async (req, res) => {
    try {
        const jobPost = await JobPostModel.findOneAndUpdate({ jobpost_id: req.params.id }, req.body);
        res.status(200).json({ message: "求人を更新しました。", jobpost: jobPost });
    } catch (error) {
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.getJobPostById = async (req, res) => {
    try {
        const jobPost = await JobPostModel.findOne({ jobpost_id: req.params.id });

        if (!jobPost) {
            return res.status(404).json({ message: "Job post not found", error: true });
        }

        // Fetch customer and facility details
        const customer = await customerModel.findOne({ customer_id: jobPost.customer_id });
        const facility = await facilityModel.findOne({ facility_id: jobPost.facility_id });

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
        const jobPosts = await JobPostModel.find({ facility_id: req.params.id }).sort({ created_at: -1 });

        if (!jobPosts) {
            return res.status(404).json({ message: "Job post not found", error: true });
        }

        // Resolve customer and facility data
        const jobPostsWithDetails = await Promise.all(
            jobPosts.map(async (jobpost) => {
                const customer = await customerModel.findOne({ customer_id: jobpost.customer_id });
                const facility = await facilityModel.findOne({ facility_id: jobpost.facility_id });
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
}

exports.getJobPosts = async (req, res) => {
    try {
        const jobPosts = await JobPostModel.find({}).sort({ created_at: -1 });
        
        // Resolve customer and facility data
        const jobPostsWithDetails = await Promise.all(
            jobPosts.map(async (jobpost) => {
                const customer = await customerModel.findOne({ customer_id: jobpost.customer_id });
                const facility = await facilityModel.findOne({ facility_id: jobpost.facility_id });
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


exports.pendingJobPost = async (req, res) => {
    try {
        const jobPost = await JobPostModel.findOne({jobpost_id: req.params.id});
        jobPost.allowed = "pending";
        await jobPost.save();
        res.status(200).json({ message: "求人掲載申請成功", jobPost: jobPost });
    } catch (error) {
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.allowJobPost = async (req, res) => {
    try {
        const jobPost = await JobPostModel.findByIdAndUpdate(req.params.id, { allowed: "allowed", registered_at: new Date() });
        res.status(200).json({ message: "求人を許可しました。", jobpost: jobPost });
    } catch (error) {
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}
