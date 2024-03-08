import express from 'express'

import {
  getAllUsersController,
  postCurrentUserFromMongoDB,
  uploadUserProfile,
} from '@/controllers/userController'

const routerUser = express.Router()

routerUser.get('/', getAllUsersController)
routerUser.post('/', postCurrentUserFromMongoDB)
routerUser.patch('/:userId', uploadUserProfile)

export { routerUser }
