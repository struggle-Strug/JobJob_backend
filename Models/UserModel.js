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
        type: String,
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
    jobType: [
        {
            type: {
                type: String
            },
            period: {
                type: String
            },
        }
    ],  
    employmentType: {
        type: Array,
    },
    employmentDate: {
        type: String,
    },
    desireYearSalary: {
        type: String,
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
    prefecture: [
        {
            type: String,
        }
    ],
    photo: {
        type: String,
    },
    lastEducation: {
        type: String,
    },
    schoolName: {
        type: String,
    },
    department: {
        type: String,
    },
    major: {
        type: String,
    },
    graduation: {
        type: String,
    },
    graduationDate: {
        type: String,
    },
    workHistories: [
        {
            companyName: {
                type: String,
            },
            contents: {
                type: String,
            },
            startDate: {
                type: String,
            },
            endDate: {
                type: String,
            },
            employmentType: {
                type: String,
            },
            jobType: {
                type: String,
            },
            jobTypeDetail: {
                type: String,
            },
            workContent: {
                type: String,
            },
            officialPosition: {
                type: String,
            },
            payType: {
                type: String,
            },
            amount: {
                type: String,
            }
        }
    ]
});

module.exports = mongoose.model("User", userSchema);
