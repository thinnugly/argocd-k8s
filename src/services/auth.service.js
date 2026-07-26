import prisma from '../config/prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '../config/env.js'
import { email } from 'zod'

export async function register (data) {
    
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
    })

    if(existingUser) {
        throw new Error('The address is already registered in the system.')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }
    })
    return user
}

export async function login(data) {
    
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
    })

    if(!existingUser) {
        throw new Error('Invalid email or password.')
    }  
    
    const validPassword = await bcrypt.compare(data.password, existingUser.password)
    if(!validPassword) {
        throw new Error('Invalid email or password.')
    }

    const token = jwt.sign({ id: existingUser.id, email: existingUser.email}, env.jwtSecret, { expiresIn: '1d' })
    return {
        token,
        user: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email
        }
    }
}

export async function findAllUsers() {
    
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return users
}