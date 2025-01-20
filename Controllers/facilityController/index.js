const FacilityModel = require("../../Models/FacilityModel");

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
                                facility_genre: req.body.facility_genre, 
                                service_type: req.body.service_type, 
                                establishment_date: req.body.establishment_date, 
                                service_time: req.body.service_time, 
                                rest_day: req.body.rest_day 
                            });
        await newFacility.save();
        res.status(200).json({ message: "施設登録成功", facility: newFacility });
    } catch (error) {
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.getFacilities = async (req, res) => {
    try {
        const facilities = await FacilityModel.find({ allowed: true });
        res.status(200).json({ message: "施設取得成功", facility: facilities });
    } catch (error) {
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.getAllFacilities = async (req, res) => {
    try {
        const facilities = await FacilityModel.find().populate('customer_id').sort({ createdAt: -1 });
        res.status(200).json({ message: "施設取得成功", facility: facilities });
    } catch (error) {
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.getFacility = async (req, res) => {
    try {
        const facility = await FacilityModel.findById(req.params.id);
        res.status(200).json({ message: "施設取得成功", facility: facility });
    } catch (error) {
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.allowFacility = async (req, res) => {
    try {
        const facility = await FacilityModel.findById(req.params.id);
        facility.allowed = true;
        facility.registrationDate = new Date();
        await facility.save();
        res.status(200).json({ message: "施設承認成功", facility: facility });
    } catch (error) {
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}
