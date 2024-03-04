import { UserType } from './user'

export type ChatType = {
  _id: string
  users: UserType[]
  createdBy: UserType
  isGroupChat: boolean
  groupName?: string
  groupProfilePicture?: string
  groupBio?: string
  groupAdmins: []
  createdAt: string
}
