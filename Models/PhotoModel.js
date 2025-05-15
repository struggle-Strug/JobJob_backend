const mongoose = require("mongoose");

const PhotoModel = mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  images: [
    {
      photoName: {
        type: String,
      },
      photoUrl: {
        type: String,
      },
      description: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Photo", PhotoModel);
