const mongoose = require('mongoose')
const urlSchema = new mongoose.Schema(
	{
		urlID: {
			type: String,
			required: true,
			trim: true,
		},
		originalUrl: {
			type: String,
			required: true,
			trim: true,
		},
		shortUrl: {
			type: String,
			required: true,
			trim: true,
		},
		clicks: {
			type: Number,
			required: true,
			default: 0,
		},
		addedDate: {
			type: Date,
			default: new Date(),
		},
	},
	{ timestamps: true }
)
module.exports = mongoose.model('Url', urlSchema)
