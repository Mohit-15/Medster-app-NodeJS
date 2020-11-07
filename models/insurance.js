var mongoose = require("mongoose");

const InsuranceSchema = new mongoose.Schema({
	company: {
		type: String,
		required: true,
		maxlength: 80,
		trim: true,
		unique: true
	}
});

module.exports = mongoose.model("Insurance", InsuranceSchema)