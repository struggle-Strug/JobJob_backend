const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AdminSchema = new mongoose.Schema({
  loginId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
});

// Check if model exists before creating it to avoid model redefinition
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

// Function to seed a default admin user
const seedDefaultAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ loginId: "admin" });

    if (!adminExists) {
      console.log("Seeding default admin user...");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = new Admin({
        loginId: "admin",
        name: "システム管理者",
        password: hashedPassword,
      });

      await admin.save();
      console.log("Default admin user created successfully!");
    } else {
      console.log("Default admin user already exists.");
    }
  } catch (err) {
    console.error("Error creating default admin user:", err);
  }
};

// Call the seeding function explicitly after model initialization
seedDefaultAdmin();

module.exports = Admin;
