const prisma = require('../database/prisma')
const AppError = require('../utils/AppError')

exports.getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany()

        if (!users) {
            throw new AppError("Error getting users", 500)
        }

        return users
    } catch (err) {
        throw err
    }
}

exports.getUserWithPassword = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            throw new AppError("Error getting a user", 500)
        }

        return user
    } catch (err) {
        throw err
    }
}

exports.getUserById = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                userId: userId
            }
        })

        if (!user) {
            throw new AppError("Error getting a user", 500)
        }

        return user
    } catch (err) {
        throw err
    }
}