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
        required: true
    },
    creationDate: {
        type: String,
        required: true
    },
    selfPR: {
        type: String,
        required: true
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
                required: true
            },
            contents: {
                    type: String,
                    required: true
            },
            startDate: {
                type: Date,
                required: true
            },
            endDate: {
                type: Date,
                required: true
            },
            employmentType: {
                type: String,
                required: true
            },
            jobTypeDetail: {
                type: String,
                required: true
            },
            workContent: {
                type: String,
                required: true
            },
            officialPosition: {
                type: String,
                required: true
            }
        }
    ]
})

module.exports = mongoose.model("Career", CareerSchema);

