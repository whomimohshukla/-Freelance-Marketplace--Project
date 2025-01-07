const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["Basic", "Professional", "Enterprise", "Custom"],
      required: true,
    },
    features: [
      {
        name: String,
        enabled: Boolean,
        usage: Number,
        limit: Number,
      },
    ],
    billing: {
      amount: Number,
      currency: String,
      interval: String,
      nextBillingDate: Date,
    },
    paymentMethod: {
      type: String,
      provider: String,
      last4: String,
      expiryDate: String,
    },
    status: {
      type: String,
      enum: ["Active", "Cancelled", "Past Due", "Trial"],
      default: "Active",
    },
    trialEnds: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;
