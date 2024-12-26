const mongoose = require("mongoose");

const RirekiSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    basic : {
        name: {
            type: String,
        },
        hiraganaName:{
            type: String,
        },
        birthday:{
            type: String,
        },
        gender:{
            type: String,
        },
        photo: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        email: {
            type: String,
        },
        prefecture: {
            type: Array,
        },
        otherPhone: {
            type: String,
        },
        otherEmail: {
            type: String,
        },
        otherPrefecture: {
            type: String,
        },
    },
    education: [
        {
            schoolName_department_major: {
                type: String,
            },
            notes: [{
                type: String,
            }],
            admissionDate: {
                type: String,
            },
            graduationDate: {
                type: String,
            },
            admission: {
                type: String,
            },
            graduation: {
                type: String,
            },
        }
    ],
    workhistory: [
        {
            companyName: {
                type: String,
            },
            notes: [{
                type: String,
            }],
            startDate: {
                type: String,
            },
            endDate: {
                type: String,
            },
            endStatus: {
                type: String,
            },
            resignationReason: {
                type: String,
            },
        }
    ],
    qualification: [{
        qualification: { type: String, required: true },
        year: { type: Number },
        month: { type: Number },
    }],
    other: {
        time: {
            type: String,
        },
        dependents: {
            type: String,
        },
        spouse: {
            type: String,
        },
    },
    desire: {
        applyReason: {
            type: String,
        },
        hope: {
            type: String,
        }
    },
    creationDate: {
        type: String,
    },
});

const Rireki = mongoose.model("Rireki", RirekiSchema);

module.exports = Rireki;
