const prisma = require('../database/prisma')
const { AppError } = require('../utils/AppError')

exports.registerUser = async (email, password, username) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                password: password,
                username: username
            }
        })

        if (!user) {
            throw new AppError("Error registering user", 500)
        }

        return user
    } catch (err) {
        throw err
    }
}