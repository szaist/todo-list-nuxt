export const useDeleteTodo = async (todoId: string) => {
  return await useApiFetch(`collections/todos/records/${todoId}`, {
    method: 'DELETE',
  })
}
