const mongoose = require("mongoose");

const FacilitySchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    facility_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    postal_code: {
        type: String,
        required: true,
    },
    prefecture: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        // required: true,
    },
    village: {
        type: String,
        // required: true,
    },
    building: {
        type: String,
        // required: true,
    },
    photo: {
        type: String,
    },
    introduction: {
        type: String,
    },
    job_type: [{
        type: String
    }],
    access_station: {
        type: String,
    },
    facility_genre: {
        type: String,
        required: true,
    },
    service_type: [{
        type: String,
    }],
    establishment_date: {
        type: String,
    },
    service_time: {
        type: String,
    },
    rest_day: {
        type: String,
    },
    allowed: {
        type: String,
        default: "pending"
    },
    registrationDate: {
        type: Date,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Facility", FacilitySchema);
