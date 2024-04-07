import type { UpdateTodoRequest } from '~/app/contracts/todo/UpdateTodoRequest'

export const usePatchTodo = (
  todoId: string,
  updatedTodo: UpdateTodoRequest,
): Promise<any> => {
  return useApiFetch(`collections/todos/records/${todoId}`, {
    method: 'PATCH',
    body: updatedTodo,
  })
}
