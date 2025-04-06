const z = require('zod')
const { createValidator } = require('./main')

const registerSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string(),
    username: z.string().max(72, "Too long username"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string(),
})

const registerValidator = createValidator({ bodySchema: registerSchema });
const loginValidator = createValidator({ bodySchema: loginSchema });


module.exports = {
    registerValidator,
    loginValidator,
};