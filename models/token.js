var mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const tokenSchema = new mongoose.Schema({
    _userId: { 
    	type: ObjectId, 
    	required: true, 
    	ref: 'User' 
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

module.exports = mongoose.model("TokenGenerator", tokenSchema);