const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  member_id: {
    type: String,
    required: true,
  },
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
        type: String,
      },
      period: {
        type: String,
      },
    },
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
  qualification: [
    {
      qualification: { type: String, required: true },
      year: { type: Number },
      month: { type: Number },
    },
  ],
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
  },
  municipality: {
    type: String,
  },
  village: {
    type: String,
  },
  building: {
    type: String,
  },
  desirePrefecture: [
    {
      type: String,
    },
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
      },
    },
  ],
  setting: {
    notificationEmail: {
      type: Boolean,
      default: true, // Default value set to true
    },
    message: {
      type: Boolean,
      default: true, // Default value set to true
    },
    newJob: {
      type: Boolean,
      default: true, // Default value set to true
    },
    recommendJob: {
      type: Boolean,
      default: true, // Default value set to true
    },
  },
  role: {
    type: String,
    default: "member",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  postalCode: {
    type: String,
  },
  currentStatus: {
    type: String,
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

module.exports = mongoose.model("User", userSchema);
