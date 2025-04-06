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