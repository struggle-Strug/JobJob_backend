const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customer_id: { type: String, required: true },
  companyName: { type: String, required: true },
  huriganaCompanyName: { type: String },
  contactPerson: { type: String },
  huriganaContactPerson: { type: String },
  phoneNumber: { type: String },
  email: { type: String, required: true },
  password: { type: String },
  role: { type: String, default: "customer" },
  // allowed: { type: Boolean, default: false },
  registrationDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Customer", customerSchema);
