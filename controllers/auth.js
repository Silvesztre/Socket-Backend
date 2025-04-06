const User = require('../repositories/User')
const Auth = require('../repositories/Auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config({ path: '../database/config.env' })

/* POST - /auth/register */
exports.registerUser = async (req, res, next) => {
    try {
        const { email, password, username } = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create user
        const user = await Auth.registerUser(email, hashedPassword, username)

        const { password: _, ...safeUser } = user;

        res.status(200).json({success: true, data: safeUser})
    } catch (err) {
        res.status(400).json({success: false})
        console.log(err.stack)
    }
}

/* GET - /auth/login */
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body

        // Check for user
        const user = await User.getUserWithPassword(email)

        const hashedPassword = user.password
        const isMatch = await bcrypt.compare(password, hashedPassword)

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                msg: 'Invalid credentials'
            })
        }

        // Create token
        // const token = user.getSignedJwtToken()
        // res.status(200).json({success: true, token})
        sendTokenResponse(user, 200, res)
    } catch (err) {
        res.status(400).json({success: false})
        console.log(err.stack)
    }
}

const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE})

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        //add for frontend
        userId: user.userId,
        email: user.email,
        username: user.username,
        profileUrl: user.profileUrl,
        //end for frontend
        token
    })
}