const express = require('express')
const { getAllUsers, getUserById } = require('../controllers/users')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.get('/', protect, getAllUsers)
router.get('/:userId', protect, getUserById)

module.exports = router