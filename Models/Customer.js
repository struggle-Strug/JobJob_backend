const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    companyName: {type: String, required: true},
    huriganaCompanyName: {type: String, required: true},
    contactPerson: {type: String, required: true},
    huriganaContactPerson: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    email: {type: String, required: true},
    allowed: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now}
})

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;