const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    hiraganaName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    jobType: {
        type: Array,
    },  
    employmentType: {
        type: Array,
    },
    qualification: [{
        qualification: { type: String, required: true },
        year: { type: Number },
        month: { type: Number },
    }],
    feature: {
        type: Array,
    },
    dependents: {
        type: Number,
    },
    spouse: {
        type: String,
    },
    selfPR: {
        type: String,
    },
    prefecture: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("User", userSchema);
