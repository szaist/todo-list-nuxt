import type { CreateTodoRequest } from '~/app/contracts/todo/CreateTodoRequest'
import type { Todo } from '~/app/models/Todo'

export const useAddTodo = async (request: CreateTodoRequest): Promise<Todo> => {
  const authStore = useAuthStore()
  const id = authStore.currentUser?.id

  return await useApiFetch('collections/todos/records', {
    method: 'POST',
    body: { ...request, created_by: id },
  })
}
