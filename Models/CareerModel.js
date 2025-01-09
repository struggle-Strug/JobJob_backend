const mongoose = require("mongoose");

const CareerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    creationDate: {
        type: String,
    },
    selfPR: {
        type: String,
    },
    qualification: [{
        qualification: { type: String, required: true },
        year: { type: Number },
        month: { type: Number },
    }],
    workHistories: [
        {
            companyName: {
                type: String,
            },
            contents: {
                    type: String,
            },
            startDate: {
                type: Date,
            },
            endDate: {
                type: Date,
            },
            employmentType: {
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
            }
        }
    ]
})

module.exports = mongoose.model("Career", CareerSchema);

