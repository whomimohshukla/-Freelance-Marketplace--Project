const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    milestone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project.milestones",
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    transactionId: String,
    platformFee: Number,
    escrowReleaseDate: Date,
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
