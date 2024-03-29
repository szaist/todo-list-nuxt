import type { Priority } from "~/app/types"

export type CreateTodoRequest = {
    title: string
    description?: string
    priority: Priority
    deadline?: Date
    completed?: boolean
    order: number
    fav?: boolean
}