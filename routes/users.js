const express = require('express')
const { getAllUsers, getUserById, editProfile } = require('../controllers/users')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.get('/', protect, getAllUsers)
router.get('/:userId', protect, getUserById)
router.patch('/profile/:userId', protect, editProfile)

module.exports = router