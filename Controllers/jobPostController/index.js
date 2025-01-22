const JobPostModel = require("../../Models/JobPostModel")

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
    res.status(200).json({ message: "求人を登録しました", jobpost: newJobPost });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.getJobPost = async (req, res) => {
    try {
        const jobPost = await JobPostModel.find({ facility_id: req.params.id }).populate("customer_id");
        res.status(200).json({ jobpost: jobPost });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.getJobPosts = async (req, res) => {
    try {
        const jobPosts = await JobPostModel.find({}).populate("customer_id").populate("facility_id").sort({ created_at: -1 });
        res.status(200).json({ jobposts: jobPosts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.allowJobPost = async (req, res) => {
    try {
        const jobPost = await JobPostModel.findByIdAndUpdate(req.params.id, { allowed: "allowed", registered_at: new Date() });
        res.status(200).json({ message: "求人を許可しました", jobpost: jobPost });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}
