import express from 'express'
import { validate } from '../middlewares/validation.middleware.js'
import { registerSchema, loginSchema } from '../validations/auth.validation.js'
import * as authController from '../controllers/auth.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'    

const router = express.Router()

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
router.get('/', authenticate, authController.findAllUsers)

export default router