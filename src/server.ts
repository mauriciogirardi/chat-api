import cors from 'cors'
import express from 'express'

import { app } from './app'
import { connectMongoDB } from './db'
import { env } from './env'
import { errorHandler } from './error/errorHandler'
import { routerChat } from './routes/chatRouters'
import { routerMessage } from './routes/messageRouters'
import { routerUser } from './routes/userRouters'
import { socketHandler } from './socketHandler'

connectMongoDB()
app.use(express.json())

app.use(cors())

app.use('/users', routerUser)
app.use('/chats', routerChat)
app.use('/messages', routerMessage)

app.use(errorHandler)

const server = app.listen(env.PORT, () => {
  console.info(`Server is running port ${env.PORT}!`)
})

socketHandler(server)
