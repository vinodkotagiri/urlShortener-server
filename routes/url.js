const express = require('express')
const router = express.Router()
const { shortenUrl, getOriginalUrl } = require('../controllers/url')
router.post('/shorten', shortenUrl)
router.get('/:urlID', getOriginalUrl)
module.exports = router
