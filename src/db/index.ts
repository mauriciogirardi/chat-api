import mongoose from 'mongoose'

import { env } from '@/env'

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URL)
    console.info('MongoDB connected!!')
  } catch (error) {
    console.error(error)
  }
}
