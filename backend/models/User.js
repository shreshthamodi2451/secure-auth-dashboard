const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  // otpCode: {
  //   type: String
  // },

  // otpExpires: {
  //   type: Date
  // }

  twoFactorEnabled: {
  type: Boolean,
  default: false
},

 twoFactorMethod: {
  type: String,
  enum: ["email", "authenticator"],
  default: "authenticator"
},

twoFactorSecret: {
    type: String,
    default: null
},

loginOTP: {
  type: String,
  default: null
},

loginOTPExpires: {
  type: Date,
  default: null
},

isVerified: {
  type: Boolean,
  default: false
},

emailOTP: {
  type: String,
  default: null
},

emailOTPExpires: {
  type: Date,
  default: null
}


}, {
  timestamps: true
});

module.exports = mongoose.model(
  "User",
  userSchema
);