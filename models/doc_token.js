var mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const DoctorTokenSchema = new mongoose.Schema({
    _userId: { 
    	type: ObjectId, 
    	required: true, 
    	ref: 'Doctor' 
    },
    token: { 
    	type: String, 
    	required: true 
    },
    createdAt: { 
    	type: Date, 
    	required: true, 
    	default: Date.now, 
    	expires: 43200 
    }
});

module.exports = mongoose.model("DoctorTokenGenerator", DoctorTokenSchema);