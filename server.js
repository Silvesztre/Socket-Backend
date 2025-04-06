// Import libraries here
const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors');

dotenv.config({ path: './database/config.env' })

const app = express()

app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Cors
const corsOptions = {
    origin: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));

// Add routes
const auth = require('./routes/auth')
app.use('/auth', auth)

const users = require('./routes/users')
app.use('/users', users)

module.exports=app