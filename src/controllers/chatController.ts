import { Request, Response } from 'express'
import z from 'zod'

import { ChatModel } from '../models/chatModel'

export const createNewChatController = async (req: Request, res: Response) => {
  try {
    const schemaBort = z.object({
      users: z.string().array(),
      createdBy: z.string(),
      isGroupChat: z.boolean().optional(),
      groupName: z.string().optional(),
      groupProfilePicture: z.string().optional(),
      groupBio: z.string().optional(),
      groupAdmins: z.string().array().optional(),
      unreadCounts: z.object({}).optional(),
    })

    const data = schemaBort.parse(req.body)

    await ChatModel.create(data)
    const chats = await ChatModel.find({
      users: {
        $in: [data.createdBy],
      },
    })
      .populate('users')
      .sort({ updatedAt: -1 })

    return res.status(200).json({ chats })
  } catch (error) {
    console.error(error)
  }
}

export const getAllChatsController = async (req: Request, res: Response) => {
  try {
    const schemaParams = z.object({
      userId: z.string(),
    })

    const { userId } = schemaParams.parse(req.params)

    const chats = await ChatModel.find({
      users: {
        $in: [userId],
      },
    })
      .populate('users')
      .populate('lastMessage')
      .populate('createdBy')
      .populate({ path: 'lastMessage', populate: { path: 'sender' } })
      .sort({ lastMessageAt: -1 })

    return res.status(200).json({ chats })
  } catch (error) {
    console.error(error)
  }
}

export const getChatDataByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const schemaParams = z.object({
      chatId: z.string(),
    })

    const { chatId } = schemaParams.parse(req.params)

    const chat = await ChatModel.findById(chatId)
      .populate('users')
      .populate('lastMessage')
      .populate('createdBy')
      .populate({ path: 'lastMessage', populate: { path: 'sender' } })
      .sort({ updatedAt: -1 })

    return res.status(200).json({ chat })
  } catch (error) {
    console.error(error)
  }
}

export const updateChatController = async (req: Request, res: Response) => {
  try {
    const schemaParams = z.object({
      chatId: z.string(),
    })

    const schemaBody = z.object({
      users: z.array(z.string()),
      createdBy: z.string(),
      isGroupChat: z.boolean().optional(),
      lastMessage: z.object({}).optional(),
      groupName: z.string().optional(),
      groupProfilePicture: z.string().optional(),
      groupBio: z.string().optional(),
      groupAdmins: z.array(z.string()).optional(),
      unreadCounts: z.object({}).optional(),
    })

    const { chatId } = schemaParams.parse(req.params)
    const chat = schemaBody.parse(req.body)

    const chatUpdated = await ChatModel.findByIdAndUpdate(chatId, chat)
    return res.status(200).json({ chat: chatUpdated })
  } catch (error) {
    console.error(error)
  }
}
