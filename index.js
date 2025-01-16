const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { globSync } = require("glob");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors({ origin: "*" }));

// Parse JSON bodies
app.use(bodyParser.json({ limit: "5mb" })); // Send JSON responses
app.use(bodyParser.urlencoded({ extended: false, limit: "5mb" })); // Parses urlencoded bodies

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));


// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
};

connectToMongoDB();

// Passport
app.use(passport.initialize());

const routes = new globSync("./Routers/*Router.js");

routes.forEach((file) => {
  // Convert file path to proper format
  const router = require(path.resolve(file));
  
  // Get the base name of the router (e.g., "userRouter" from "userRouter.js")
  const routeName = path.basename(file, '.js').toLowerCase().replace('router', '');
  // Use the router with its path
  app.use(`${process.env.API_PREFIX}/${routeName}`, router);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
