const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    previousPasswords: {
      type: [String],
      default: [],
      maxlength: 5
    },
    role: {
      type: String,
      enum: ["freelancer", "client", "admin"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
      required: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    location: {
      current: {
        ip: String,
        city: String,
        country: String,
        timezone: String,
        coordinates: {
          latitude: Number,
          longitude: Number
        },
        lastUpdated: {
          type: Date,
          default: Date.now
        }
      },
      previous: {
        ip: String,
        city: String,
        country: String,
        timezone: String,
        coordinates: {
          latitude: Number,
          longitude: Number
        },
        lastUpdated: Date
      }
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
    },
    twoFactorSecret: {
      type: String,
      default: null
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    tempVerificationCode: {
      type: String,
      default: null
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.index({ role: 1 });

const User = mongoose.model("User", userSchema);
module.exports = User;
