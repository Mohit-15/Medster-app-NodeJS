var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 40,
    trim: true,
    required: true
  },
  email: {
    type: String,
    maxlength: 80,
    trim: true,
    unique: true,
    required: true
  },
  insurance: {
    type: String,
    maxlength: 80,
    trim: true,
  },
  dob: {
    type: Date,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
    maxlength: 50,
    required: true
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
});

module.exports = mongoose.model("User", UserSchema);