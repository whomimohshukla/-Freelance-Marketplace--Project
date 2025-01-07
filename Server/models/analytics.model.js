const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: [
      "Profile View",
      "Project View",
      "Search",
      "Message",
      "Proposal",
      "Payment",
    ],
  },
  data: {
    page: String,
    duration: Number,
    source: String,
    device: String,
    location: String,
    action: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Analytics = mongoose.model("Analytics", analyticsSchema);
module.exports = Analytics;
