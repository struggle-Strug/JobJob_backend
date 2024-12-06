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
        required: true,
    },  
    employmenType: {
        type: Array,
        required: true,
    },
    qualification: {
        type: Array,
        required: true,
    },
    feature: {
        type: Array,
        required: true,
    },
    prefecture: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("User", userSchema);
