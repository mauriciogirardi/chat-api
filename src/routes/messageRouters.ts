import express from 'express'

import {
  getChatMessagesController,
  readAllMessagesControllers,
  sendNewMessageController,
} from '@/controllers/messageController'

const routerMessage = express.Router()

routerMessage.get('/:chatId', getChatMessagesController)
routerMessage.post('/', sendNewMessageController)
routerMessage.post('/read', readAllMessagesControllers)

export { routerMessage }
