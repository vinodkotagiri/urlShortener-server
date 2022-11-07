const express = require('express')
const router = express.Router()
const { register, activate, login, forgotPassword, resetPassword } = require('../controllers/auth')
router.post('/register', register)
router.post('/activate', activate)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

module.exports = router
