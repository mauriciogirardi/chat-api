import { Server } from 'socket.io'

import { app } from './app'
import { env } from './env'
import { ChatType } from './types/chat'
import { PayloadSendNewMessage } from './types/payload-send-new-message'

const server = app.listen(env.PORT, () => {
  console.info(`Server is running port ${env.PORT}!`)
})

const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

let onlineUsers: string[] = []

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    if (!socket.rooms.has(userId)) {
      socket.join(userId)

      if (!onlineUsers.includes(userId)) {
        onlineUsers.push(userId)
      }
    }

    onlineUsers.forEach((user) => {
      io.to(user).emit('online-users-updated', onlineUsers)
    })
  })

  socket.on('send-new-message', (message: PayloadSendNewMessage) => {
    message.chat.users.forEach((user) => {
      io.to(user._id).emit('new-message-received', message)
    })
  })

  socket.on(
    'read-all-messages',
    ({
      chatId,
      users,
      readByUserId,
    }: {
      chatId: string
      readByUserId: string
      users: string[]
    }) => {
      users?.forEach((user) => {
        io.to(user).emit('user-read-all-chat-messages', {
          chatId,
          readByUserId,
        })
      })
    },
  )

  socket.on(
    'typing',
    ({
      chat,
      senderId,
      senderName,
    }: {
      chat: ChatType
      senderId: string
      senderName: string
    }) => {
      chat.users.forEach((user) => {
        if (user._id !== senderId) {
          io.to(user._id).emit('typing', { chat, senderName })
        }
      })
    },
  )

  socket.on('logout', (userId: string) => {
    socket.leave(userId)
    onlineUsers = onlineUsers.filter((user) => user !== userId)

    onlineUsers.forEach((user) => {
      io.to(user).emit('online-users-updated', onlineUsers)
    })
  })
})

app.get('/', (req, res) => {
  return res.send({ message: 'This is api chat' })
})
