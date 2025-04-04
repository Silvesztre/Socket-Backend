const express = require('express')
const { registerUser, getAllUsers } = require('../controllers/users')

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/').get(getAllUsers)

module.exports = router