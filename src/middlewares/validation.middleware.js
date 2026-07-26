import { ZodError } from 'zod';

export function validate(schema) {
    return (req, res, next) => {
        try {
            req.validateDate = schema.parse(req.body)
            next()
        } catch (error) {
            if(error instanceof ZodError) {
                return res.status(400).json({
                    errors: error.issues.map(issue => ({
                        field: issue.path[0],
                        message: issue.message
                    }))
                })
            }
            return res.status(500).json({
                message: 'Validation failed.'
            })
        }
    }
}