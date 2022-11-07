const express = require('express')
const { customAlphabet } = require('nanoid')
const Url = require('../models/url')
const { isValidUrl } = require('../helpers/isValidUrl')
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdeffghijklmnopqrstuvwxyz01234567890', 8)
exports.shortenUrl = async (req, res) => {
	const { originalUrl } = req.body
	const BASE_URL = process.env.BASE_SERVER_URL
	const urlID = nanoid()
	try {
		let url = await Url.findOne({ originalUrl })
		if (!isValidUrl(originalUrl)) return res.status(400).json({ error: 'Invalid url' })
		if (url) {
			return res.status(200).json(url)
		} else {
			const shortUrl = `${BASE_URL}/url/${urlID}`
			url = await new Url({ originalUrl, shortUrl, urlID }).save()
			res.status(201).json(url)
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: 'Something went wrong : ' + error })
	}
}

exports.getOriginalUrl = async (req, res) => {
	try {
		const urlID = req.params.urlID
		const url = await Url.findOne({ urlID })
		if (!url) return res.status(400).json({ error: 'Url does not exist' })
		await Url.findOneAndUpdate({ urlID }, { $inc: { clicks: 1 } })
		res.redirect(url.originalUrl)
	} catch (error) {
		res.status(500).json({ error: 'Something went wrong : ' + error })
	}
}

exports.list = async (req, res) => {
	const { limit, skip } = req.query
	console.log(limit, skip)
	try {
		const urls = await Url.find({})
			.limit(limit ? limit : 10)
			.skip(skip ? skip : 0)
		const createdInMonths = await Url.aggregate([
			{
				$group: {
					_id: { $substr: ['$addedDate', 5, 2] },
					createdUrls: { $sum: 1 },
				},
			},
		])

		const createdToday = await Url.find({ start_date: { $gte: new Date('2015-05-27T00:00:00Z') } })
		const totalDocuments = await Url.find({}).length
		const data = { urls, createdInMonths, shortenedToday: createdToday.length, totalDocuments, skip, limit }
		res.status(200).json(data)
	} catch (error) {
		res.status(500).json({ error: 'Something went wrong : ' + error })
	}
}
