import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import homeRoutes from './routes/home.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(express.json())

app.use('/', homeRoutes)
app.use('/api/auth', authRoutes)

export default app;