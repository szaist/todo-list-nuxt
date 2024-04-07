import type { Priority } from '../types'

export type Todo = {
  id: string
  title: string
  description?: string
  priority: Priority
  deadline?: Date
  completed?: boolean
  order: number
  fav?: boolean
}
