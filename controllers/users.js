const User = require('../repositories/User')

/* GET - /users */
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.getAllUsers()

        res.status(200).json({success: true, data: users})
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

        if (!user) {
            return res.status(404).json({success: false, msg: `Cannot find user with id ${userId}`})
        }

        res.status(200).json({success: true, data: user})
    } catch (err) {
        res.status(400).json({success: false})
        console.log(err.stack)
    }
}