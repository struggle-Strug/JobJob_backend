const mongoose = require("mongoose");

const MessageModel = new mongoose.Schema({
  message_id: {
    type: String,
    required: true,
  },
  jobPost_id: {
    type: String,
    required: true,
  },
  first: {
    type: String,
    required: true,
  },
  second: {
    type: String,
    required: true,
  },
  content: [
    {
      sender: {
        type: String,
        required: true,
      },
      recevier: {
        type: String,
        required: true,
      },
      message: {
        type: String,
      },
      files: [
        {
          fileName: {
            type: String,
          },
          fileUrl: {
            type: String,
          },
        },
      ],
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  status: {
    type: String,
    default: "応募済",
  },
  memo: {
    type: String,
    default: "",
  },
  deleted: {
    type: Boolean,
    default: false,
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

module.exports = mongoose.model("Message", MessageModel);
