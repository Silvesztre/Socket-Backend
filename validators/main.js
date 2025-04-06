const { ZodSchema } = require("zod");

/**
 * @param {Object} schemas
 * @param {ZodSchema} [schemas.paramSchema]
 * @param {ZodSchema} [schemas.querySchema]
 * @param {ZodSchema} [schemas.bodySchema]
 */
const createValidator = ({ paramSchema, bodySchema, querySchema }) => {
    return (req, res, next) => {
        if (paramSchema) {
            const result = paramSchema.safeParse(req.params);
            if (!result.success) {
                res.status(422).json({ errors: result.error.format() });
                return;
            }
        }

        if (querySchema) {
            const result = querySchema.safeParse(req.query);
            if (!result.success) {
                res.status(422).json({ errors: result.error.format() });
                return;
            }
        }

        if (bodySchema) {
            const result = bodySchema.safeParse(req.body);
            if (!result.success) {
                console.log(result.error);
                res.status(422).json({ errors: result.error.format() });
                return;
            }
        }

        next();
    };
};

module.exports = { createValidator };
