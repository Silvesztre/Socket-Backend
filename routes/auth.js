const express = require('express')
const { registerUser, loginUser, logout } = require('../controllers/auth')
const { registerValidator, loginValidator } = require('../validators/auth')

const router = express.Router()

router.post('/register', registerValidator, registerUser)
router.post('/login', loginValidator, loginUser)
router.get('/logout', logout)

module.exports = router