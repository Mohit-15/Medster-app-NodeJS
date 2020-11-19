var mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
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
	specialization: {
		type: String,
		trim: true,
		maxlength: 50,
		required: true
	},
	city: {
	    type: String,
	    trim: true,
	    maxlength: 50,
	    required: true
  	},
  	yoe: {
  		type: String,
  		required: true,
  		maxlength: 50,
  		trim: true,
  		unique: true
  	},
  	isVerified: { 
	    type: Boolean, 
	    default: false 
  	},
});

module.exports = mongoose.model("Doctor", DoctorSchema)