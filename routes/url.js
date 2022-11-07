const express = require('express')
const router = express.Router()
const { shortenUrl, getOriginalUrl, list } = require('../controllers/url')
router.post('/shorten', shortenUrl)
router.get('/:urlID', getOriginalUrl)
router.get('/', list)
module.exports = router
