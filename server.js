// Import libraries here
const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

dotenv.config({ path: './database/config.env' })

const app = express()

app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Add routes
const auth = require('./routes/auth')
app.use('/auth', auth)

const users = require('./routes/users')
app.use('/users', users)

const PORT = process.env.PORT || 5000

const server = app.listen(
    PORT,
    console.log(
        'Server running in ',
        process.env.NODE_ENV,
        'mode on port ',
        PORT
    )
)

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error:${err.message}`)
    server.close(() => process.exit(1))
})