const mongoose = require("mongoose");

const PhotoModel = mongoose.Schema({
  customer_id: {
    type: String,
    required: true,
  },
  images: [
    {
      photoName: {
          type: String
      },
      photoUrl: {
        type: String
      },
      description: {
          type: String
      }
    }
  ],
});

module.exports = mongoose.model("Photo", PhotoModel);