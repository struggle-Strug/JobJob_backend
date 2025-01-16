const FacilityModel = require("../../Models/FacilityModel");

exports.createFacility = async (req, res) => {
    try {
        const newFacility = new FacilityModel({ 
                                user_id: req.body.user_id,
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
        console.log(error);
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.getFacilities = async (req, res) => {
    try {
        const facilities = await FacilityModel.find();
        res.status(200).json({ message: "施設取得成功", facility: facilities });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}

exports.getFacility = async (req, res) => {
    try {
        const facility = await FacilityModel.findById(req.params.id);
        res.status(200).json({ message: "施設取得成功", facility: facility });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "サーバーエラー", error: true });
    }
}
