// Import libraries here
const express = require('express')
const dotenv = require('dotenv')

dotenv.config({ path: './database/config.env' })

const app = express()
app.use(express.json())

// Add routes
const users = require('./routes/users')
app.use('/users', users)

module.exports=app