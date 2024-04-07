import type { User } from '~/app/models/User'
import type { TokenResponse } from './TokenResponse'

export type LoginResponse = TokenResponse & {
  record: User
}
