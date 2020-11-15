var mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		maxlength: 50,
		required: true
	},
	specialization: {
		type: String,
		trim: true,
		maxlength: 50,
		required: true
	}
});

module.exports = mongoose.model("Doctor", DoctorSchema)