const mongoose = require("mongoose");

const JobPostSchema = new mongoose.Schema({
  facility_id: {
    type: String,
    required: true,
  },
  customer_id: {
    type: String,
    required: true,
  },
  jobpost_id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  picture: {
    type: [String],
  },
  sub_title: {
    type: String,
    required: true,
  },
  sub_description: {
    type: String,
    required: true,
  },
  work_item: [
    {
      type: String,
      required: true,
    },
  ],
  work_content: {
    type: String,
    required: true,
  },
  service_subject: [
    {
      type: String,
    },
  ],
  service_type: [
    {
      type: String,
    },
  ],
  employment_type: [
    {
      type: String,
      required: true,
    },
  ],
  salary_type: {
    type: String,
    required: true,
  },
  salary_max: {
    type: String,
    required: true,
  },
  salary_min: {
    type: String,
    required: true,
  },
  salary_remarks: {
    type: String,
  },
  expected_income: {
    type: String,
  },
  treatment_type: [
    {
      type: String,
    },
  ],
  treatment_content: {
    type: String,
  },
  work_time_type: [
    {
      type: String,
    },
  ],
  work_time_content: {
    type: String,
    required: true,
  },
  rest_type: [
    {
      type: String,
    },
  ],
  rest_content: {
    type: String,
    required: true,
  },
  special_content: {
    type: String,
  },
  education_content: [
    {
      type: String,
    },
  ],
  qualification_type: [
    {
      type: String,
      required: true,
    },
  ],
  qualification_other: [
    {
      type: String,
    },
  ],
  qualification_content: {
    type: String,
  },
  qualification_welcome: {
    type: String,
  },
  process: {
    type: String,
    required: true,
  },
  allowed: {
    type: String,
    default: "draft",
  },
  registered_at: {
    type: Date,
    default: Date.now,
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

module.exports = mongoose.model("JobPost", JobPostSchema);
