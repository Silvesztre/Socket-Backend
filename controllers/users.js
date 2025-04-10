const User = require('../repositories/User')

/* GET - /users */
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.getAllUsers()

        const sanitizedUsers = users.map(({ password, ...rest }) => rest)
        
        res.status(200).json({ success: true, data: sanitizedUsers })
        
        res.status(200).json({success: true, data: data})
    } catch(err) {
        res.status(400).json({success: false})
        console.log(err.stack)
    }
}

/* GET - /users/userId */
exports.getUserById = async (req, res, next) => {
    try {
        const userId = req.params.userId

        const user = await User.getUserById(userId)

        const {password, ...sanitizedUser} = user

        if (!user) {
            return res.status(404).json({success: false, msg: `Cannot find user with id ${userId}`})
        }

        res.status(200).json({success: true, data: sanitizedUser})
    } catch (err) {
        res.status(400).json({success: false})
        console.log(err.stack)
    }
}

/* PATCH - /users/profile/:userId */
exports.editProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        if (userId != req.params.userId) {
            return res.status(403).json({success: false, msg: 'You are not allowed to edit this profile'})
        }

        const { username, profileUrl } = req.body
        const {password, ...editedData} = await User.editProfile(userId, username, profileUrl)

        res.status(200).json({success: true, data: editedData})
    } catch (err) {
        res.status(400).json({success: false})
        console.log(err.stack)
    }
}