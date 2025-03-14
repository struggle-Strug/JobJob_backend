const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true, unique: true },
  postalCode: {
    type: String,
    required: true,
  },
  prefecture: {
    type: String,
    required: true,
  },
  municipality: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  buildingName: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  contactPersonHurigana: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Company", CompanySchema);
