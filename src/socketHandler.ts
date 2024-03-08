/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from 'socket.io'

import { ChatType } from './types/chat'
import { PayloadSendNewMessage } from './types/payload-send-new-message'

export function socketHandler(server: any) {
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
      'add-user-chat',
      ({
        chats,
        userId,
        type,
      }: {
        chats: ChatType[]
        userId: string
        type: 'chat' | 'group'
      }) => {
        if (type === 'chat') {
          io.to(userId).emit('add-new-user-chat', chats)
        } else {
          chats.forEach((chat) => {
            chat.users.forEach((user) => {
              io.to(user._id).emit('add-new-user-chat', chats)
            })
          })
        }
      },
    )

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
}
