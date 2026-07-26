import dotenv from 'dotenv'
dotenv.config()


export default {
    port: process.env.PORT,
    databasUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET
}