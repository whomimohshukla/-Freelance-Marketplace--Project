const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    content: {
      type: String,
      required: true,
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
    readStatus: {
      isRead: {
        type: Boolean,
        default: false,
      },
      readAt: Date,
    },
    messageType: {
      type: String,
      enum: ["text", "file", "system", "video_call_invite"],
      default: "text",
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
