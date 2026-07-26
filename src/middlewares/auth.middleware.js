import jwt from 'jsonwebtoken'
import env from '../config/env.js'

export function authenticate(req, res, next) {

    const token = req.headers.authorization
    if(!token) {
        return res.status(401).json({
            message: 'Token not provided.'
        })
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), env.jwtSecret)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token.'
        })
    }
}