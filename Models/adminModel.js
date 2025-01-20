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

// Pre-hook to hash the password before saving
AdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Check if model exists before creating it to avoid model redefinition
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

// Function to seed a default admin user
const seedDefaultAdmin = async () => {
  const defaultAdmin = {
    loginId: "admin",
    name: "システム管理者",
    password: "admin123", // This will be hashed in the pre-hook
  };

  try {
    const adminExists = await Admin.findOne({ loginId: defaultAdmin.loginId });
    if (!adminExists) {
      console.log("Seeding default admin user...");
      const admin = new Admin(defaultAdmin);
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
