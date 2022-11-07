require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const urlRoutes = require('./routes/url')
const app = express()
//Middleware
app.use(
	morgan(
		':remote-addr - :remote-user [:date[clf]] :method :url HTTP/:http-version :status :res[content-length] :referrer :user-agent'
	)
)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes
app.use('/auth', authRoutes)
app.use('/url', urlRoutes)
//db
mongoose.connect(process.env.MONGO_URI, () => console.log('Database connection established!'))

//Express server

const PORT = process.env.PORT || 27570

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
