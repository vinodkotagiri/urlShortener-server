const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	lastName: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	verified: {
		type: Boolean,
		default: false,
	},
	resetCode: {
		type: String,
		default: null,
	},
})

module.exports = mongoose.model('User', userSchema)
