const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { sendVerificationMail, sendResetCode } = require('../helpers/mailer')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)
//controller for registering user
async function register(req, res) {
	try {
		const { firstName, lastName, email, password } = req.body
		//Check if user is already exists
		const check = await User.findOne({ email })
		if (check) return res.status(400).json({ error: 'User already exists, try a different email!' })
		//password length should be >=6
		if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
		//Encrypt password
		const hashedPassword = await bcrypt.hash(password, 12)
		const user = await new User({ firstName, lastName, email, password: hashedPassword }).save()
		//Generate a token for verifying email
		const verificationToken = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '30min' })
		const redirectUrl = `${process.env.BASE_CLIENT_URL}/activate/${verificationToken}`
		sendVerificationMail(firstName, email, redirectUrl)
		res.status(200).json({ message: 'User created successfully' })
	} catch (error) {
		res.status(500).json({ error: 'Something went wrong, ' + error })
	}
}
//controller for activate user
async function activate(req, res) {
	try {
		const { token } = req.body
		const user = jwt.verify(token, process.env.JWT_SECRET)
		const checkUser = await User.findById(user._id)
		if (checkUser.verified) return res.status(400).json({ error: 'Email already verified!' })
		await User.findByIdAndUpdate({ _id: user._id }, { verified: true })
		res.status(200).json({ message: 'Email verified successfully' })
	} catch (error) {
		res.status(500).json({ error: 'Something went wrong, ' + error })
	}
}
//controller for login
async function login(req, res) {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email })
		if (!user) return res.status(400).json({ error: 'Email you entered is not registered' })
		if (!user.verified) return res.status(400).json({ error: 'Account not verified!' })
		const checkPswd = await bcrypt.compare(password, user.password)
		if (!checkPswd) return res.status(400).json({ error: 'Password you entered is incorrect' })
		const { password: passwd, ...rest } = user._doc
		const token = jwt.sign({ _id: user._id.toString() }, '7d')
		res.status(200).json({ message: 'User successfully logged in!', user: rest, token })
	} catch (error) {
		res.status(500).json({ error: 'Something went wrong, ' + error })
	}
}
//controller for forgot password
async function forgotPassword(req, res) {
	try {
		const { email } = req.body
		const user = await User.findOne({ email })
		if (!user) return res.status(404).json({ error: 'Incorrect email provided!' })
		//if the user is not verified
		if (!user.verified) {
			const verificationToken = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
				expiresIn: '30min',
			})
			const redirectUrl = `${process.env.BASE_CLIENT_URL}/activate/${verificationToken}`
			sendVerificationMail(user.firstName, user.email, redirectUrl)
			res.status(200).json({ message: 'Sent a verification mail to your inbox!' })
		} else {
			const resetCode = nanoid()
			await User.findByIdAndUpdate({ _id: user._id }, { resetCode: resetCode })
			sendResetCode(user.firstName, user.email, resetCode)
			res.status(200).json({ message: 'Sent a reset code to your email', email: user.email })
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: 'Something went wrong, ' + error })
	}
}
//controller for password reset
async function resetPassword(req, res) {
	try {
		const { email, newPassword, resetCode } = req.body
		const user = await User.findOne({ email })
		if (resetCode !== user.resetCode) return res.status(400).json({ error: 'Invalid reset code' })
		const hashedPassword = await bcrypt.hash(newPassword, 12)
		await User.findOneAndUpdate({ email }, { password: hashedPassword, resetCode: null })

		res.status(200).json({ message: 'Password updated successfully' })
	} catch (error) {
		res.status(500).json({ error: 'Something went wrong, ' + error })
	}
}
module.exports = { register, activate, login, forgotPassword, resetPassword }
