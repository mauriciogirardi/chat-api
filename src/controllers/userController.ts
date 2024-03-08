import { Request, Response } from 'express'
import z from 'zod'

import { UserModel } from '../models/userModel'

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find()
    if (!users) {
      return res.status(404).json({ message: 'Not users found!' })
    }

    return res.status(200).json({ users })
  } catch (error) {
    console.log(error)
  }
}

export const postCurrentUserFromMongoDB = async (
  req: Request,
  res: Response,
) => {
  try {
    const schemaBody = z.object({
      clerkUserId: z.string(),
      name: z.string(),
      username: z.string(),
      email: z.string(),
      profilePicture: z.string(),
    })

    const { clerkUserId, email, name, profilePicture, username } =
      schemaBody.parse(req.body)

    const alreadyUserExistis = await UserModel.findOne({
      clerkUserId,
    })

    if (alreadyUserExistis) {
      return res.status(201).json({ user: alreadyUserExistis })
    }

    const newUserPayload = {
      clerkUserId,
      name,
      username,
      email,
      profilePicture,
    }

    const user = await UserModel.create(newUserPayload)

    res.status(200).json({ user })
  } catch (error) {
    console.error(error)
  }
}

export const uploadUserProfile = async (req: Request, res: Response) => {
  try {
    const schemaBody = z.object({
      profilePicture: z.string(),
    })

    const schemaParams = z.object({
      userId: z.string(),
    })

    const { profilePicture } = schemaBody.parse(req.body)
    const { userId } = schemaParams.parse(req.params)

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { profilePicture },
      {
        new: true,
      },
    )

    return res.status(200).json({ user })
  } catch (error) {
    console.error(error)
  }
}
