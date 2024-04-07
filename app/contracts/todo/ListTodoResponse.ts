import type { Todo } from '~/app/models/Todo'

export type ListTodoResponse = Pagination & {
  items: Todo[]
}

export type Pagination = {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}
