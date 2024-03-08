import { Request, Response } from 'express'
import z from 'zod'

import { ChatModel } from '@/models/chatModel'
import MessageModel from '@/models/messageModel'

export const sendNewMessageController = async (req: Request, res: Response) => {
  try {
    const schemaBort = z.object({
      text: z.string().optional(),
      image: z.string().optional(),
      chat: z.string(),
      sender: z.string(),
      readBy: z.array(z.string()).optional(),
      socketMessageId: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })

    const data = schemaBort.parse(req.body)

    const newMessage = new MessageModel(data)
    await newMessage.save()

    const existingChat = await ChatModel.findById(data.chat)
    const existingUnreadCounts = existingChat?.unreadCounts as {
      [key: string]: number
    }

    existingChat?.users.forEach((userId) => {
      const userIdInString = userId.toString()

      if (userIdInString !== data.sender) {
        existingUnreadCounts[userIdInString] =
          (existingUnreadCounts[userIdInString] || 0) + 1
      }
    })

    await ChatModel.findByIdAndUpdate(data.chat, {
      lastMessage: newMessage._id,
      unreadCounts: existingUnreadCounts,
      lastMessageAt: new Date().toISOString(),
    })

    return res.status(201).send()
  } catch (error) {
    console.error(error)
  }
}

export const getChatMessagesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const schemaParams = z.object({ chatId: z.string() })
    const { chatId } = schemaParams.parse(req.params)

    const messages = await MessageModel.find({ chat: chatId })
      .populate('sender')
      .sort({ createdAt: 1 })

    return res.status(200).json({ messages })
  } catch (error) {
    console.error(error)
  }
}

export const readAllMessagesControllers = async (
  req: Request,
  res: Response,
) => {
  try {
    const schemaParams = z.object({ chatId: z.string(), userId: z.string() })
    const { chatId, userId } = schemaParams.parse(req.body)

    await MessageModel.updateMany(
      {
        chat: chatId,
        sender: { $ne: userId },
        readBy: {
          $nin: [userId],
        },
      },
      { $addToSet: { readBy: userId } },
    )

    const existingChat = await ChatModel.findById(chatId)
    const existingUnreadCounts = existingChat?.unreadCounts
    const newUnreadCounts = { ...existingUnreadCounts, [userId]: 0 }

    await ChatModel.findByIdAndUpdate(chatId, {
      unreadCounts: newUnreadCounts,
    })

    return res.status(201).send()
  } catch (error) {
    console.error(error)
  }
}
