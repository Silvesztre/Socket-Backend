const User = require('../repositories/User')

/* POST - /users/register */
exports.registerUser = async (req, res, next) => {
    try {
        const { email, password } = req.body

        // Create user
        const user = await User.registerUser(email, password)

        return res.status(200).json({success: true, data: user})
    } catch (err) {
        res.status(400).json({success: false})
        console.log(err.stack)
    }
}

/* GET - /users */
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.getAllUsers()

        return res.status(200).json({success: true, data: users})
    } catch(err) {
        res.status(400).json({success: false})
        console.log(err.stack)
    }
}