import { ChatType } from './chat'
import { UserType } from './user'

export type PayloadSendNewMessage = {
  chat: ChatType
  socketMessageId: string
  sender: UserType
  text: string
  image?: string
}
