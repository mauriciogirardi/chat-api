import express from 'express'

import {
  createNewChatController,
  getAllChatsController,
  getChatDataByIdController,
  updateChatController,
} from '@/controllers/chatController'

const routerChat = express.Router()

routerChat.get('/:chatId', getChatDataByIdController)
routerChat.get('/user/:userId', getAllChatsController)
routerChat.post('/', createNewChatController)
routerChat.put('/:chatId', updateChatController)

export { routerChat }
