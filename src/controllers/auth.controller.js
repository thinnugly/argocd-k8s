import * as authService from '../services/auth.service.js'

export async function register(req, res) {
    try {
        const user = await authService.register(req.validateDate)
        return res.status(201).json({
            message: 'User created successfully.',
            user
        })
    } catch (error) {
        if(error.message === 'The address is already registered in the system.') {
            return res.status(400).json({
                message: error.message
            })
        }
        return res.status(500).json({
            message: 'Internal server error.'
        })
    }
}

export async function login(req, res) {
    try {
        const loggedUser = await authService.login(req.validateDate)
        return res.status(200).json(
            loggedUser
        )
    } catch (error) {
        if(error.message === 'Invalid email or password.') {
            return res.status(401).json({
                message: error.message
            })
        }

        return res.status(500).json({
            message: 'Internal server error.'
        })
    }
}

export async function findAllUsers(req, res) {
    try {
        const users = await authService.findAllUsers()
        const loggedUser = req.user.email
        return res.status(200).json({
            loggedUser: loggedUser,
            users
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error.'
        })
    }
}